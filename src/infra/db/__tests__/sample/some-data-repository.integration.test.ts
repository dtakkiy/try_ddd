import { SomeData } from 'src/domain/sample/entity/some-data';
import { createRandomIdString } from 'src/util/random';
import { prisma } from '@testUtil/prisma';
import { SomeDataRepository } from '../../repository/sample/some-data-repository';

describe('some-data-repository.integration.ts', () => {
  const someDataRepo = new SomeDataRepository(prisma);
  beforeAll(async () => {
    await prisma.someData.deleteMany({});
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  describe('save', () => {
    afterEach(async () => {
      await prisma.someData.deleteMany({});
    });
    it('[正常系]someDataを保存できる', async () => {
      const someDataExpected = {
        id: createRandomIdString(),
        required: false,
        number: 1,
      };
      await someDataRepo.save(new SomeData(someDataExpected));

      const allSomeDatas = await prisma.someData.findMany({});
      expect(allSomeDatas).toHaveLength(1);
      expect(allSomeDatas[0]).toEqual(someDataExpected);
    });
  });
});
