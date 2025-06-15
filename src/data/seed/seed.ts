import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMOTIONS = ["joy", "sadness", "anger", "fear", "surprise", "love", "disgust", "neutral"];

function getRandomEmotion() {
  return EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const userId = "ddf1ce3a-c3b8-4b53-a3a7-9797de173a27"; 

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 7); // últimos 10 días

  for (let i = 0; i < 50; i++) {
    await prisma.emotionRecord.create({
      data: {
        user_id: userId,
        emotion: getRandomEmotion(),
        created_at: randomDateBetween(start, today),
      },
    });
  }

  console.log("🧠 Seed completada con 50 emociones aleatorias");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
