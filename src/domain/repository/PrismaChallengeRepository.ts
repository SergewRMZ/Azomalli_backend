import { Challenge, PrismaClient } from "@prisma/client";
import { CreateChallengeDTO } from "../dtos/challenge";
import { ChallengeRepository } from "./interfaces/ChallengeRepository";

export class PrismaChallengeRepository implements ChallengeRepository {
  private prisma = new PrismaClient();
  
  async create(createChallengeDTO: CreateChallengeDTO): Promise<Challenge | null> {
    try {
      const challenge = await this.prisma.challenge.create({
        data: {
          user_id: createChallengeDTO.user_id,
          tittle: createChallengeDTO.title,
          description: createChallengeDTO.description,
          completed: createChallengeDTO.completed,
          created_at: createChallengeDTO.created_at
        }
      });

      return challenge;
    } catch (error) {
      return null;
    }
  }

   async getAllById(user_id: string, skip: number, pageSize: number): Promise<Challenge[] | null> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          user_id: user_id 
        },
        take: pageSize,  
        skip: skip,      
        orderBy: {
          created_at: 'desc'
        }
      });

      return challenges;
    } catch (error) {
      console.error('Error obteniendo los desafíos:', error);
      throw new Error('No se pudieron obtener los desafíos');
    }
  }

  async countAllChallengesByUser(user_id: string): Promise<number> {
    const count = await this.prisma.challenge.count({
      where: {
        user_id
      }
    });
    return count;
  }
}