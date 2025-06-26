import { CustomError, PaginationDto, PrismaEmotionRepository } from "../../domain";
import { CreateActivityDTO } from "../../domain";
import { PrismaActivityRepository } from "../../domain";

export class ActivityService {
  constructor(private readonly prismaActivityRepository: PrismaActivityRepository,
    private readonly prismaEmotionRepository: PrismaEmotionRepository
  ) {}

  public async registerActivity(createActivityDto: CreateActivityDTO, adminId: string) {
    const existActivity = await this.prismaActivityRepository.findByUrl(createActivityDto.url);

    if(existActivity) {
      throw CustomError.badRequest('Una actividad con la misma url ya está registrada');
    }

    const activity = await this.prismaActivityRepository.create(createActivityDto, adminId);
    return {
      status: 'success',
      message: 'Actividad registrada correctamente'
    }
  }

  public async getActivities (paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;

    const activites = await this.prismaActivityRepository.findAllActivitiesPaginated(skip, pageSize);
    const total = await this.prismaActivityRepository.countAllActivites();

    return {
      page: page,
      pageSize: pageSize,
      total: total,
      next: `/api/activity?page=${page + 1}&pageSize=${pageSize}`,
      previous: (page - 1) > 0 ? `/api/activity?page=${page - 1}&pageSize=${pageSize}` : null,
      activites
    }
  }

  public async getActivitiesByDominantEmotion(userId: string) {
    const emotionRecords = await this.prismaEmotionRepository.getLast7Days(userId);
    if (emotionRecords.length === 0) {
      return {
        status: 'empty',
        message: 'No se encontraron emociones registradas en los últimos 7 días.',
        activities: []
      };
    }

    const emotionCount = emotionRecords.reduce((acc, record) => {
      acc[record.emotion] = (acc[record.emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominantEmotion = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])[0][0];

    const activities = await this.prismaActivityRepository.findByEmotion(dominantEmotion);

    if (activities.length === 0) {
      return {
        status: 'empty',
        message: `No hay actividades asociadas a tu emoción más frecuente (${dominantEmotion}).`,
        activities: []
      };
    }

    return {
      status: 'success',
      message: `Actividades recomendadas para tu emoción más frecuente esta semana (${dominantEmotion})`,
      emotion: dominantEmotion,
      activities
    };
  }
}