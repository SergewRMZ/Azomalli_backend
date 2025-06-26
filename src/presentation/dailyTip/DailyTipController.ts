import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from '../../domain';

const prisma = new PrismaClient();

export class DailyTipController {
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  };

  public createDailyTip = async (req: Request, res: Response) => {
    try {
      const adminId = req.body.user.id; // asegúrate de que el middleware agregue `user.id`
      const { emotion, tip, image_dailyTip } = req.body;

      if (!emotion || !tip) {
        throw CustomError.badRequest('Los campos emotion y tip son obligatorios');
      }

      const newTip = await prisma.dailyTip.create({
        data: {
          emotion,
          tip,
          image_dailyTip,
          admin_id: adminId,
        },
      });

      return res.status(201).json({
        message: 'Consejo diario creado correctamente',
        tip: newTip,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getDailyTip = async (_req: Request, res: Response) => {
    try {
      const tips = await prisma.dailyTip.findMany({
        where: {
          active: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: 3,
      });

      return res.status(200).json({ tips });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
