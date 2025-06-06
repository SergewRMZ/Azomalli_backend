
export class EmotionRecordDto {
  private constructor (
    public user_id: string,
    public emotion: string,
    public created_at: string
  ) {}

  static create (object: {[key: string]: any}): [string?, EmotionRecordDto?] {
    const {user_id, emotion} = object;
    if (!user_id) return ['Missing User ID', undefined];
    if (!emotion) return ['Missing emotion', undefined];
    const createdAt = new Date().toISOString();
    return [undefined, new EmotionRecordDto(user_id, emotion, createdAt)];
  }
}