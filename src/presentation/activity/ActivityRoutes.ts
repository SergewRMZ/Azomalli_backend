import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PrismaActivityRepository, PrismaEmotionRepository } from "../../domain";
import { ActivityService } from "../services/activity.service";
import { ActivityController } from "./ActivityController";

export class ActivityRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaActivityRepository = new PrismaActivityRepository();
    const prismaEmotionRepository = new PrismaEmotionRepository();
    const activityService = new ActivityService(prismaActivityRepository, prismaEmotionRepository);
    const activityController = new ActivityController(activityService);
    router.post('/create', [ AuthMiddleware.validateJWT ], [AuthMiddleware.ensureAdmin], activityController.createActivity);
    router.get('/', activityController.getActivities);
    router.get('/emotion', [AuthMiddleware.validateJWT], activityController.getActivitiesByEmotion);
    return router;
  }
}