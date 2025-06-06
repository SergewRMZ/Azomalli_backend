import { CustomError, EmotionRecordDto } from "../../domain";
import { PrismaEmotionRepository } from "../../domain/repository/PrismaEmotionRepository";
import { UserInputDto } from "../../domain/dtos/emotion/UserInputDto";
import axios from "axios";

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
}