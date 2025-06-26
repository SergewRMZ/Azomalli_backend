import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { DailyTipController } from "./DailyTipController";

export class DailyTipRoutes {
  static get routes(): Router {
    const router = Router();

    const dailyTipController = new DailyTipController();
    router.post('/create', [ AuthMiddleware.validateJWT ], dailyTipController.createDailyTip);
    router.get('/', [AuthMiddleware.validateJWT], dailyTipController.getDailyTip);
    return router;
  }
}