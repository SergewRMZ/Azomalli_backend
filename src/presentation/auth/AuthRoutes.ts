import { Router } from 'express';
import { AuthController } from './AuthController';
import { UserService } from '../services/user.service';
import { PrismaUserRepository } from '../../domain/repository/PrismaUserRepository';
import { EmailService } from '../services/email.service';
import { envs } from '../../config';
import { PrismaAdminRepository } from '../../domain';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PrismaSurveyRepository } from '../../domain/repository/PrismaSurveyRepository';

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaUserRepository = new PrismaUserRepository();
    const prismaAdminRepository = new PrismaAdminRepository();
    const prismaSurveyRepository = new PrismaSurveyRepository();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );

    const accountService = new UserService(prismaUserRepository, prismaAdminRepository, emailService, prismaSurveyRepository);
    const authController = new AuthController(accountService);
    router.post('/register', authController.registerUser);
    router.post('/register-survey', [AuthMiddleware.validateJWT], authController.createSurvey);
    router.post('/update-status', [AuthMiddleware.validateJWT], authController.updateStatus);
    router.post('/register-admin', authController.registerAdmin);
    router.post('/login', authController.loginUser);
    router.post('/login-admin', authController.loginAdmin);
    router.post('/validate-email/:token', authController.validateEmail);
    return router;
  }
}