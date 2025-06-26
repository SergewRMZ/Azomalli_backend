import { Request, Response } from 'express';
import { CustomError, EmotionRecordDto } from '../../domain';
import { EmotionService } from '../services/emotion.service';
import { UserInputDto } from '../../domain/dtos/emotion/UserInputDto';

export class EmotionController {
  constructor(public readonly emotionService: EmotionService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } 

  public analyzerEmotion = (req: Request, res: Response) => {
    const userId = req.body.user.id;
    const [error, userInputDto] = UserInputDto.create({...req.body, user_id: userId});
    if (error) return res.status(400).json({ error });
    
    this.emotionService.registerEmotion(userInputDto!)
      .then((emotion) => res.json(emotion))
      .catch(error => this.handleError(error, res));
  };

  public getLastStatistics = (req:Request, res:Response) => {
    const user_id = req.body.user.id;
    
    this.emotionService.getRegistersById(user_id)
      .then((report) => res.json(report))
      .catch(error => this.handleError(error, res));
  }
}