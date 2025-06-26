import { Router } from "express";
import { AuthRoutes } from "./auth/AuthRoutes";
import { FileUploadRoutes } from "./file-upload/FileRoutes";
import { ImageRoutes } from "./images/ImageRoutes";
import { EmotionRoutes } from "./emotion/EmotionRoutes";
import { ActivityRoutes } from "./activity/ActivityRoutes";
import { ChallengeRoutes } from "./challenge/ChallengeRoutes";
import { DailyTipRoutes } from "./dailyTip/DailyTipRoutes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/emotion', EmotionRoutes.routes);
    router.use('/api/images', ImageRoutes.routes);
    router.use('/api/upload', FileUploadRoutes.routes);
    router.use('/api/activity', ActivityRoutes.routes);
    router.use('/api/challenge', ChallengeRoutes.routes);
    router.use('/api/daily-tip', DailyTipRoutes.routes);
    return router;
  }
}
