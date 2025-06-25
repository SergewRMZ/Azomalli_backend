import { PrismaClient } from "@prisma/client";

export class PrismaSurveyRepository {
  private prisma = new PrismaClient();

  async create(userId: string, surveyPath: string) {
    try {
      const newSurvey = await this.prisma.survey.create({
        data: {
          user_id: userId,  
          survey_path: surveyPath,
        },
      });
      
      return newSurvey;
    } catch (error) {
      throw new Error("Error al guardar la encuesta");
    }
  }
}