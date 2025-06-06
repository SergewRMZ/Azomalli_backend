import { EmotionRecord } from "@prisma/client";
import { EmotionRecordDto } from "../../dtos/emotion";

export abstract class EmotionRepository {
  abstract create(emotionRecordDto: EmotionRecordDto): Promise<EmotionRecord | null>
}