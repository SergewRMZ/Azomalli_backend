import { Request, Response } from 'express';
import { CreateChallengeDTO, CustomError, PaginationDto } from '../../domain';
import { ChallengeService } from '../services/challenge.service';

export class ChallengeController {
  constructor(public readonly challengeService: ChallengeService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } 

  public createChallenge = (req: Request, res: Response) => {
    const [error, createChallengeDTO] = CreateChallengeDTO.create({...req.body, user_id: req.body.user.id});
    if(error) return res.status(400).json({ error });
    this.challengeService.registerChallenge(createChallengeDTO!)
      .then(challenge => res.json(challenge))
      .catch(error => this.handleError(error, res));
  }

  public getChallenges = (req: Request, res: Response) => {
    const { page = 1, pageSize = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +pageSize);

    if( error ) res.status(400).json({error});
    const userId = req.body.user.id;
    this.challengeService.getChallenges(paginationDto!, userId)
      .then( activites => res.json(activites))
      .catch( error => this.handleError(error, res));
  }
}