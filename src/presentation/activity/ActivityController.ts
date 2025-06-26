import { Request, Response } from 'express';
import { CustomError, PaginationDto } from '../../domain';
import { ActivityService } from '../services/activity.service';
import { CreateActivityDTO } from '../../domain';
import { error } from 'console';

export class ActivityController {
  constructor(public readonly activityService: ActivityService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } 

  public createActivity = (req: Request, res:Response) => {
    const adminId = req.body.user.id;
    const [error, createActivityDto] = CreateActivityDTO.create(req.body);
    if(error) return res.status(400).json({error});
    console.log(adminId);
    this.activityService.registerActivity(createActivityDto!, adminId)
      .then((activity) => res.json(activity))
      .catch((error) => this.handleError(error, res));
  }

  public getActivities = (req: Request, res: Response) => {
    const { page = 1, pageSize = 5 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +pageSize);

    if( error ) res.status(400).json({error});

    this.activityService.getActivities(paginationDto!)
      .then( activites => res.json(activites))
      .catch( error => this.handleError(error, res));
  }

  public getActivitiesByEmotion = (req: Request, res: Response) => {
    const userId = req.body.user.id;
    this.activityService.getActivitiesByDominantEmotion(userId)
      .then(activities => res.json(activities))
      .catch(error => this.handleError(error, res));
  }
}