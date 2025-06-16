import { CustomError } from "../../domain";
import { CreateActivityDTO } from "../../domain";
import { PrismaActivityRepository } from "../../domain";

export class ActivityService {
  constructor(private readonly prismaActivityRepository: PrismaActivityRepository) {}

  public async registerActivity(createActivityDto: CreateActivityDTO) {
    const existActivity = await this.prismaActivityRepository.findByUrl(createActivityDto.url);

    if(existActivity) {
      throw CustomError.badRequest('Una actividad con la misma url ya está registrada');
    }

    const activity = await this.prismaActivityRepository.create(createActivityDto);
    return {
      status: 'success',
      message: 'Actividad registrada correctamente'
    }
  }

}