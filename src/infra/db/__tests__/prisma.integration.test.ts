import { prisma } from '@testUtil/prisma';

describe('prism全般に関するテスト', () => {
  beforeAll(async () => {
    await prisma.someData.deleteMany();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe('基本的なcrud機能', () => {
    afterEach(async () => {
      await prisma.someData.deleteMany();
    });
    it('DBに追加できる', async () => {
      await prisma.someData.create({
        data: {
          id: '1',
          required: true,
          number: 4,
        },
      });
      const allSomeData = await prisma.someData.findMany();
      expect(allSomeData).toHaveLength(1);
    });
  });
  describe('トランザクション', () => {
    it('トランザクション処理中に問題が発生したらロールバックされる', async () => {
      try {
        const task1 = prisma.someData.create({
          data: {
            id: '1',
            required: true,
            number: 4,
          },
        });
        const task2 = prisma.someData.create({
          data: {
            id: '1', // idの重複によりエラーが発生する
            required: true,
            number: 4,
          },
        });
        await prisma.$transaction([task1, task2]);
      } catch (error) {
        const allSomeData = await prisma.someData.findMany();
        expect(allSomeData).toHaveLength(0);
      }
    });
  });
});
