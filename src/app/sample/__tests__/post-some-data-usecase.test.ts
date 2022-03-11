import { PrismaClient } from '@prisma/client';
import { SomeDataRepository } from 'src/infra/db/repository/sample/some-data-repository';
import { PostSomeDataUseCase } from '../post-some-data-usecase';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/sample/some-data-repository');

describe('do', () => {
  let mockSomeDataRepo: MockedObjectDeep<SomeDataRepository>;
  beforeAll(() => {
    const prisma = new PrismaClient();
    mockSomeDataRepo = mocked(new SomeDataRepository(prisma), true);
  });
  it('[正常系]: 例外が発生しない', async () => {
    const usecase = new PostSomeDataUseCase(mockSomeDataRepo);
    return expect(
      usecase.do({
        required: false,
        number: 1,
      })
    ).resolves.toBe(undefined);
  });
  it('[異常系]: someDataRepo.saveで例外が発生した場合、例外が発生する', () => {
    const ERROR_MESSAGE = 'error!';
    mockSomeDataRepo.save.mockRejectedValueOnce(ERROR_MESSAGE);
    const usecase = new PostSomeDataUseCase(mockSomeDataRepo);
    return expect(
      usecase.do({
        required: false,
        number: 1,
      })
    ).rejects.toEqual(ERROR_MESSAGE);
  });
});
