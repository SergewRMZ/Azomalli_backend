import { regularExps } from "../../../config";
export class UserLoginDto {
  constructor (
    public email: string,
    public password: string
  ) {}

  static create (object: {[key: string]: any}): [string?, UserLoginDto?] {
    const {email, password} = object;
    if(!email) return ['Missing Email', undefined];
    if(!password) return ['Missing Passwod', undefined];

    if(!regularExps.email.test(email)) return ['El correo no es válido', undefined];
    if(!regularExps.password.test(password)) return ['La contraseña debe contener por lo menos un número, una mayúscula, una minúscula y un carácter especial', undefined];
    return [undefined, new UserLoginDto(email, password)];
  }
}