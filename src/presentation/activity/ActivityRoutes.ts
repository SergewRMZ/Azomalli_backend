import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PrismaActivityRepository } from "../../domain";
import { ActivityService } from "../services/activity.service";
import { ActivityController } from "./ActivityController";

export class ActivityRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaActivityRepository = new PrismaActivityRepository();

    const activityService = new ActivityService(prismaActivityRepository);
    const activityController = new ActivityController(activityService);
    router.post('/create', [ AuthMiddleware.validateJWT ], [AuthMiddleware.ensureAdmin], activityController.createActivity);
    router.get('/', activityController.getActivities);
    return router;
  }
}