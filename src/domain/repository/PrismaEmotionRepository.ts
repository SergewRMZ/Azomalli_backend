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
}