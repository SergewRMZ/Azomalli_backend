import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { AdminRegisterDto, UserLoginDto } from '../../domain/dtos/auth';
import { UserRegisterDto } from '../../domain/dtos/auth';
import { UserService as UserService } from '../services/user.service';
import { error } from 'console';

export class AuthController {
  constructor(public readonly userService: UserService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } 

  public registerAdmin = (req: Request, res:Response) => {
    const [error, adminRegisterDto] = AdminRegisterDto.create(req.body);
    if(error) return res.status(400).json({ error });

    this.userService.registerAdmin(adminRegisterDto!)
      .then(admin => res.json(admin))
      .catch(error => this.handleError(error, res));
  }

  public registerUser = (req: Request, res: Response) => {
    const [error, userRegisterDto] = UserRegisterDto.create(req.body);
    if (error) return res.status(400).json({ error });
    
    this.userService.registerUser(userRegisterDto!)
      .then((user) => res.json(user))
      .catch(error => this.handleError(error, res));
  };

  public loginAdmin = (req: Request, res: Response) => {
    const [error, userLoginDto] = UserLoginDto.create(req.body);
    if(error) return res.status(400).json({ error })
    this.userService.loginAdmin(userLoginDto!)
      .then((user) => res.json(user))
      .catch(error => this.handleError(error, res));
  }

  public loginUser = (req:Request, res:Response) => {
    const [error, userLoginDto] = UserLoginDto.create(req.body);
    if(error) return res.status(400).json({ error });
    
    this.userService.loginUser(userLoginDto!)
      .then((user) => res.json(user))
      .catch(error => this.handleError(error, res));
  }

  public validateEmail = (req:Request, res:Response) => {
    const { token } = req.params;
    this.userService.validateEmail(token)
      .then(() => res.json('Email Validated'))
      .catch( error => this.handleError(error, res));
  }

  public createSurvey = (req: Request, res: Response) => {
    const userId =req.body.user.id;
    const answers = req.body.answers;
    const password = req.body.password;

    this.userService.saveSurvey(userId, answers, password)
      .then(survey => res.json(survey))
      .catch(error => this.handleError(error, res));
  }
}