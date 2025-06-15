import { CustomError, EmotionRecordDto } from "../../domain";
import { PrismaEmotionRepository } from "../../domain/repository/PrismaEmotionRepository";
import { UserInputDto } from "../../domain/dtos/emotion/UserInputDto";
import axios from "axios";
import dayjs from "dayjs";
import { group } from "console";


export class EmotionService {
  constructor(private readonly prismaEmotionRepository: PrismaEmotionRepository) {}

  public async registerEmotion(userInputDto: UserInputDto) {
    try {
      const response = await axios.post("http://localhost:5010/analizar-emocion", {
        mensaje: userInputDto.text
      });

      const emociones = response.data.emociones;
      console.log(emociones);
      if(!Array.isArray(emociones) || emociones.length === 0) {
        throw CustomError.internalServer(`Ocurrió un error al analizar el texto.`);
      }
      const top = emociones.sort((a: any,b:any) => b.score - a.score)[0];
      const emotion = top[0].label;

      // Se crea el DTO con la información sobre el estado emocional del usuario y se registra.
      const [error, emotionRecordDto] = EmotionRecordDto.create({
        user_id: userInputDto.user_id,
        emotion: top[0].label
      });


      const emotionRecord = await this.prismaEmotionRepository.create(emotionRecordDto!);
      if (emotionRecord == null) throw CustomError.internalServer('Internal Server Error');

      return {
        emotion
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        throw CustomError.internalServer(`${error}`);
      }
    }
  }

  public async getRegistersById(user_id: string) {
    const emotions = await this.prismaEmotionRepository.getLast7Days(user_id);
    
    const grouped: Record<string, Record<string, number>> = {};

    emotions.forEach(record => {
      const date = dayjs(record.created_at).format('YYYY-MM-DD');
      const emotion = record.emotion;

      if (!grouped[date]) grouped[date] = {};
      if (!grouped[date][emotion]) grouped[date][emotion] = 0;

      grouped[date][emotion]++;
    });

    const today = dayjs();
    const report = [];

    for(let i = 6; i >= 0; i--) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD');
      const emotionData = grouped[date] || {};
      const total = Object.values(emotionData).reduce((sum, count) => sum + count, 0);

      let dominantEmotion = 'none';
      if(total > 0) {
        dominantEmotion = Object.entries(emotionData).sort((a, b) => b[1] - a[1])[0][0];
      }

      report.push({
        date,
        dominantEmotion,
        emotionCount: emotionData,
        total
      });
    }

    return report;
  }

}