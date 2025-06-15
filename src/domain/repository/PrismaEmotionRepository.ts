import { EmotionRecord, PrismaClient } from "@prisma/client";
import { EmotionRecordDto } from "../dtos/emotion";
import { EmotionRepository } from "./interfaces/EmotionRepository";

export class PrismaEmotionRepository implements EmotionRepository {
  private prisma = new PrismaClient();

  async create(emotionRecordDto: EmotionRecordDto): Promise<EmotionRecord | null> {
    const createEmotionRecord = await this.prisma.emotionRecord.create({
      data: {
        user_id: emotionRecordDto.user_id,
        emotion: emotionRecordDto.emotion,
        created_at: emotionRecordDto.created_at
      }
    });

    return createEmotionRecord;
  }

  async getByUserId(userId: string): Promise<EmotionRecord[]> {
    const records = await this.prisma.emotionRecord.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return records;
  }

  async getLast7Days(userId: string): Promise<EmotionRecord[]> {
    const to = new Date(); // hoy
    const from = new Date();
    from.setDate(to.getDate() - 6);

    from.setUTCHours(0, 0, 0, 0);
    to.setUTCHours(23, 59, 59, 999);

    console.log("Buscando entre", from.toISOString(), "y", to.toISOString());

    return this.prisma.emotionRecord.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: from,
          lte: to
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });
  }
}