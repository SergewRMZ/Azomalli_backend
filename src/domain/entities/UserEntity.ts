import { CustomError } from '../errors/CustomError';
export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public email_validated: boolean,
    public surveyCompleted: boolean,
    public termsAccepted: boolean,
    public createdAt: string
  ) {}

  static fromObject(object: { [key:string]: any; } ) {
    const { 
      id,
      email,
      password,
      email_validated,
      surveyCompleted,
      termAccepted,
      created_at } = object;

    if (!id) throw CustomError.badRequest('Missing id');
    if (!email) throw CustomError.badRequest('Missing email');
    if (!password) throw CustomError.badRequest('Missing password');
    if (!created_at) throw CustomError.badRequest('Missing createdAt');
    if(!surveyCompleted) throw CustomError.badRequest('Missing survey');
    if(!termAccepted) throw CustomError.badRequest('Missing terms');
    return new UserEntity(id, email, password, email_validated, surveyCompleted, termAccepted, created_at);
  }
}