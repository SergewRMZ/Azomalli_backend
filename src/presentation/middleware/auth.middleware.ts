import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserEntity } from "../../domain/entities/UserEntity";
import { PrismaUserRepository } from "../../domain/repository/PrismaUserRepository";
import { PrismaAdminRepository } from "../../domain";
import { error } from "console";

export class AuthMiddleware {  
  static async validateJWT (req:Request, res:Response, next:NextFunction) {
    const prismaAccountRepository: PrismaUserRepository = new PrismaUserRepository();
    const prismaAdminRepository: PrismaAdminRepository = new PrismaAdminRepository();


    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer Token'});

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtAdapter.validateToken(token);
      if (!payload) return res.status(401).json({ error: 'Invalid Token' });
      const { email, role } = payload as { email: string, role: string };

      if(role === 'admin') {
        const admin = await prismaAdminRepository.findByEmail(email);
        if(!admin) return res.status(401).json({ error: 'Token inválido', message: 'Usuario no encontrado'});
        const { password, ...adminEntity } = admin;
        req.body.user = adminEntity;
      }

      else {
        const user = await prismaAccountRepository.findByEmail(email);
        if (!user) return res.status(401).json({ error: 'Token Inválido - Usuario no encontrado'});
        const userEntity = UserEntity.fromObject(user);
        req.body.user = userEntity;
      }
      
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  static async ensureAdmin (req: Request, res:Response, next: NextFunction) {
    const user = req.body.user;

    if(user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ error: 'Forbidden', message: 'Acceso denegado. No eres un usuario autorizado'});
    }
  }
}