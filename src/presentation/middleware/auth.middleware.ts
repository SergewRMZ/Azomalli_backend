import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserEntity } from "../../domain/entities/UserEntity";
import { PrismaUserRepository } from "../../domain/repository/PrismaUserRepository";

export class AuthMiddleware {  
  static async validateJWT (req:Request, res:Response, next:NextFunction) {
    const prismaAccountRepository: PrismaUserRepository = new PrismaUserRepository();
    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer Token'});

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtAdapter.validateToken(token);
      if (!payload) return res.status(401).json({ error: 'Invalid Token' });
      const {email} = payload as {email: string};
      const user = await prismaAccountRepository.findByEmail(email);
      if (!user) return res.status(401).json({ error: 'Token Inválido - Usuario no encontrado'});
      const userEntity = UserEntity.fromObject(user);
      req.body.user = userEntity;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
}