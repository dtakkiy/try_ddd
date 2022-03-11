import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const team1 = await prisma.team.upsert({
    where: { id: 'a8c18f2c-a39d-4966-b901-74f7a4d04816' },
    update: {},
    create: {
      id: 'a8c18f2c-a39d-4966-b901-74f7a4d04816',
      name: '1',
    },
  });

  console.log('seed finished.');
};

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
