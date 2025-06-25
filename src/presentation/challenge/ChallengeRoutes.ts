import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PrismaChallengeRepository } from "../../domain/";
import { ChallengeService } from "../services/challenge.service";
import { ChallengeController } from "./ChallengeController";

export class ChallengeRoutes {
  static get routes(): Router {
    const router = Router();
    const prismaChallengeRepository = new PrismaChallengeRepository();

    const challengeService = new ChallengeService(prismaChallengeRepository);
    const challengeController = new ChallengeController(challengeService);
    router.post('/create', [ AuthMiddleware.validateJWT ], challengeController.createChallenge);
    router.get('/', [AuthMiddleware.validateJWT], challengeController.getChallenges);
    return router;
  }
}