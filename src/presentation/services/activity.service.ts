import { CustomError, PaginationDto } from "../../domain";
import { CreateActivityDTO } from "../../domain";
import { PrismaActivityRepository } from "../../domain";

export class ActivityService {
  constructor(private readonly prismaActivityRepository: PrismaActivityRepository) {}

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
}