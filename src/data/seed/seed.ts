import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMOTIONS = [
  "admiration", "amusement", "anger", "annoyance", "approval", "caring", "confusion",
  "curiosity", "desire", "disappointment", "disapproval", "disgust", "embarrassment",
  "excitement", "fear", "gratitude", "grief", "joy", "love", "nervousness", "optimism",
  "pride", "realization", "relief", "remorse", "sadness", "surprise", "neutral"
];

function getRandomEmotion() {
  return EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const userId = "d9c40818-6088-4e55-86ab-dd99963e2a60"; 
  const adminId = "c43a6e74-4ee3-4788-977d-ee03a00d5d61";
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

  const dailyTips = [
    "Haz una pausa y respira profundo 3 veces.",
    "Escucha tu canción favorita para levantar el ánimo.",
    "Escribe 3 cosas que agradeces hoy.",
    "Tómate 5 minutos para estirarte y moverte.",
    "Habla con alguien en quien confíes.",
    "Dibuja algo aunque no sepas dibujar.",
    "Ve un video que te haga reír.",
    "Lee una frase motivadora.",
    "Organiza tu espacio de trabajo o estudio.",
    "Escribe una carta que nunca enviarás para liberar emociones."
  ];

  for (let i = 0; i < 10; i++) {
    await prisma.dailyTip.create({
      data: {
        emotion: getRandomEmotion(),
        tip: dailyTips[i],
        image_dailyTip: `tip-image-${i + 1}.jpg`, // Puedes corregir el path después
        active: true,
        admin_id: adminId
      }
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
