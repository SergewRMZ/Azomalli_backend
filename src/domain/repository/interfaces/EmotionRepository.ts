import { EmotionRecord } from "@prisma/client";
import { EmotionRecordDto } from "../../dtos/emotion";

export abstract class EmotionRepository {
  abstract create(emotionRecordDto: EmotionRecordDto): Promise<EmotionRecord | null>;
  abstract getByUserId(userId: string): Promise<EmotionRecord[]>;
  abstract getLast7Days(userId: string): Promise<EmotionRecord[]>
}