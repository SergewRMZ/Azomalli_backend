import { CustomError } from '../errors/CustomError';
export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public email_validated: boolean,
    public createdAt: string
  ) {}

  static fromObject(object: { [key:string]: any; } ) {
    const { 
      account_id,
      email,
      password,
      email_validated,
      created_at } = object;

    if (!account_id) throw CustomError.badRequest('Missing id');
    if (!email) throw CustomError.badRequest('Missing email');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!created_at) throw CustomError.badRequest('Missing createdAt');

    return new UserEntity(account_id, email, password, email_validated, created_at);
  }
}