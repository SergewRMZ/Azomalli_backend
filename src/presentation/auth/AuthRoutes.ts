import { Router } from 'express';
import { AuthController } from './AuthController';
import { UserService } from '../services/user.service';
import { PrismaUserRepository } from '../../domain/repository/PrismaUserRepository';
import { EmailService } from '../services/email.service';
import { envs } from '../../config';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaUserRepository = new PrismaUserRepository();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );

    const accountService = new UserService(prismaUserRepository, emailService);
    const authController = new AuthController(accountService);
    router.post('/register', authController.registerUser);
    router.post('/login', authController.loginUser);
    router.post('/validate-email/:token', authController.validateEmail);
    return router;
  }
}