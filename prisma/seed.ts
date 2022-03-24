import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const delete1 = await prisma.$transaction([
    prisma.memberOnTask.deleteMany(),
    prisma.task.deleteMany(),
    prisma.member.deleteMany(),
    prisma.pair.deleteMany(),
    prisma.team.deleteMany(),
  ]);

  const team1 = await prisma.team.upsert({
    where: { id: 'a8c18f2c-a39d-4966-b901-74f7a4d04816' },
    update: {},
    create: {
      id: 'a8c18f2c-a39d-4966-b901-74f7a4d04816',
      name: '1',
    },
  });

  const team2 = await prisma.team.upsert({
    where: { id: '0befd8b5-dd2e-4289-8d5b-06bee3482960' },
    update: {},
    create: {
      id: '0befd8b5-dd2e-4289-8d5b-06bee3482960',
      name: '2',
    },
  });

  const pair1 = await prisma.pair.upsert({
    where: { id: '7cc62aeb-a47a-40dd-a43c-64f7fccb0412' },
    update: {},
    create: {
      id: '7cc62aeb-a47a-40dd-a43c-64f7fccb0412',
      name: 'b',
      teamId: 'a8c18f2c-a39d-4966-b901-74f7a4d04816',
    },
  });

  const pair2 = await prisma.pair.upsert({
    where: { id: '1d0b060e-2e71-42aa-875c-6abc040f6764' },
    update: {},
    create: {
      id: '1d0b060e-2e71-42aa-875c-6abc040f6764',
      name: 'a',
      teamId: 'a8c18f2c-a39d-4966-b901-74f7a4d04816',
    },
  });

  const member1 = await prisma.member.upsert({
    where: { id: '6654f4fc-707a-4808-af05-a73490e3d881' },
    update: {},
    create: {
      id: '6654f4fc-707a-4808-af05-a73490e3d881',
      name: 'tanaka',
      email: 'tanaka@example.co.jp',
      status: '在籍中',
      pairId: '7cc62aeb-a47a-40dd-a43c-64f7fccb0412',
    },
  });

  const member2 = await prisma.member.upsert({
    where: { id: 'ffed9fb4-8895-45e7-8162-ad8ef09e4bc1' },
    update: {},
    create: {
      id: 'ffed9fb4-8895-45e7-8162-ad8ef09e4bc1',
      name: 'wada',
      email: 'wada@example.co.jp',
      status: '在籍中',
      pairId: '7cc62aeb-a47a-40dd-a43c-64f7fccb0412',
    },
  });

  const member3 = await prisma.member.upsert({
    where: { id: '180a879f-a95c-4b05-bd26-adf38ce29b25' },
    update: {},
    create: {
      id: '180a879f-a95c-4b05-bd26-adf38ce29b25',
      name: 'suzuki',
      email: 'suzuki@example.co.jp',
      status: '在籍中',
      pairId: '1d0b060e-2e71-42aa-875c-6abc040f6764',
    },
  });

  const member4 = await prisma.member.upsert({
    where: { id: '4753be68-5a70-42e8-adce-f6c3442f8c06' },
    update: {},
    create: {
      id: '4753be68-5a70-42e8-adce-f6c3442f8c06',
      name: 'sato',
      email: 'sato@example.co.jp',
      status: '在籍中',
      pairId: '1d0b060e-2e71-42aa-875c-6abc040f6764',
    },
  });

  const task1 = await prisma.task.upsert({
    where: { id: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204' },
    update: {},
    create: {
      id: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204',
      title: '課題3',
      content: '本文XXXXXXXXXXXXXXXXXXXXXXX',
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: '1854d175-facb-4768-ad2b-9d8d1f743399' },
    update: {},
    create: {
      id: '1854d175-facb-4768-ad2b-9d8d1f743399',
      title: '課題2',
      content: '本文XXXXXXXXXXXXXXXXXXXXXXX',
    },
  });

  const task3 = await prisma.task.upsert({
    where: { id: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c' },
    update: {},
    create: {
      id: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c',
      title: '課題1',
      content: '本文XXXXXXXXXXXXXXXXXXXXXXX',
    },
  });

  const memberOnTask1 = await prisma.memberOnTask.createMany({
    data: [
      {
        memberId: '6654f4fc-707a-4808-af05-a73490e3d881',
        taskId: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c',
        status: '未完了',
      },
      {
        memberId: '6654f4fc-707a-4808-af05-a73490e3d881',
        taskId: '1854d175-facb-4768-ad2b-9d8d1f743399',
        status: '未完了',
      },
      {
        memberId: '6654f4fc-707a-4808-af05-a73490e3d881',
        taskId: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204',
        status: '未完了',
      },

      {
        memberId: 'ffed9fb4-8895-45e7-8162-ad8ef09e4bc1',
        taskId: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c',
        status: 'レビュー待ち',
      },
      {
        memberId: 'ffed9fb4-8895-45e7-8162-ad8ef09e4bc1',
        taskId: '1854d175-facb-4768-ad2b-9d8d1f743399',
        status: '未完了',
      },
      {
        memberId: 'ffed9fb4-8895-45e7-8162-ad8ef09e4bc1',
        taskId: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204',
        status: '未完了',
      },
      {
        memberId: '180a879f-a95c-4b05-bd26-adf38ce29b25',
        taskId: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c',
        status: '完了',
      },
      {
        memberId: '180a879f-a95c-4b05-bd26-adf38ce29b25',
        taskId: '1854d175-facb-4768-ad2b-9d8d1f743399',
        status: '未完了',
      },
      {
        memberId: '180a879f-a95c-4b05-bd26-adf38ce29b25',
        taskId: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204',
        status: '未完了',
      },
      {
        memberId: '4753be68-5a70-42e8-adce-f6c3442f8c06',
        taskId: 'f57a2248-c1c3-434c-93a6-e8e26a0aea3c',
        status: '完了',
      },
      {
        memberId: '4753be68-5a70-42e8-adce-f6c3442f8c06',
        taskId: '1854d175-facb-4768-ad2b-9d8d1f743399',
        status: '未完了',
      },
      {
        memberId: '4753be68-5a70-42e8-adce-f6c3442f8c06',
        taskId: 'd4e88ff4-0b14-4f7e-a238-3764b42a8204',
        status: '未完了',
      },
    ],
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
