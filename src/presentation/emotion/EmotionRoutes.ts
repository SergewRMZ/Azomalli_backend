import { Router } from "express";
import { PrismaEmotionRepository } from "../../domain/repository/PrismaEmotionRepository";
import { EmotionService } from "../services/emotion.service";
import { EmotionController } from "./EmotionController";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class EmotionRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaEmotionRepository = new PrismaEmotionRepository();
    
    const emotionService = new EmotionService(prismaEmotionRepository);
    const emotionController = new EmotionController(emotionService);
    router.post('/analyzer', emotionController.analyzerEmotion);
    router.get('/getLastStatistics', [AuthMiddleware.validateJWT], emotionController.getLastStatistics);
    return router;
  }
}