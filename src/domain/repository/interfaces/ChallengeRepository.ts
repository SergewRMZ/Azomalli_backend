import { Challenge } from "@prisma/client";
import { CreateChallengeDTO } from "../../dtos/challenge/CreateChallengeDTO";

export abstract class ChallengeRepository {
  abstract create(createChallengeDTO: CreateChallengeDTO):Promise<Challenge | null>;
  abstract getAllById(user_id: string, skip: number, pageSize: number):Promise<Challenge[] | null>;
}