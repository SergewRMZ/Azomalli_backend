import { CreateChallengeDTO, CustomError, PaginationDto } from "../../domain";
import { PrismaChallengeRepository } from "../../domain/repository/PrismaChallengeRepository";

export class ChallengeService {
  constructor(private readonly prismaChallengeRepository: PrismaChallengeRepository) {}
  
  public async registerChallenge(createChallengeDTO: CreateChallengeDTO) {
    const challenge = await this.prismaChallengeRepository.create(createChallengeDTO);
    if(!challenge) throw CustomError.badRequest('Ocurrió un error al registrar un reto diario');
    return {
      status: 'success',
      message: 'Reto registrado correctamente'
    };
  }

  public async getChallenges (paginationDto: PaginationDto, userId: string) {
    const { page, pageSize } = paginationDto;
    const skip = (page - 1) * pageSize;

    const challenges = await this.prismaChallengeRepository.getAllById(userId, skip, pageSize);
    const total = await this.prismaChallengeRepository.countAllChallengesByUser(userId);
    
    return {
      page: page,
      pageSize: pageSize,
      total: total,
      next: `/api/activity?page=${page + 1}&pageSize=${pageSize}`,
      previous: (page - 1) > 0 ? `/api/activity?page=${page - 1}&pageSize=${pageSize}` : null,
      challenges
    }
  }
}