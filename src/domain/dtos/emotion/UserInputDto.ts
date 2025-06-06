export class UserInputDto {
  constructor(
    public user_id: string,
    public text: string
  ) {}

  static create (object: {[key: string]: any}): [string?, UserInputDto?] {
    const {user_id, text} = object;
    if (!user_id) return ['Missing User ID', undefined];
    if (!text) return ['Missing text or description', undefined];
    return [undefined, new UserInputDto(user_id, text)];
  }
}