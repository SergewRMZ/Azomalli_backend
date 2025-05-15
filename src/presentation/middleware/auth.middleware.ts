import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { AccountEntity } from "../../domain/entities/UserEntity";
import { PrismaAccountRepository } from "../../domain/repository/PrismaUserRepository";

export class AuthMiddleware {  
  static async validateJWT (req:Request, res:Response, next:NextFunction) {
    const prismaAccountRepository: PrismaAccountRepository = new PrismaAccountRepository();
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
      const accountEntity = AccountEntity.fromObject(user);
      req.body.user = accountEntity;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
}