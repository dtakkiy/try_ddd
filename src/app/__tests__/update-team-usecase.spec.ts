import { PrismaClient } from '@prisma/client';
import { mocked } from 'ts-jest/utils';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { UpdateTeamUseCase } from '../update-team-usecase';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { Team } from 'src/domain/team/team';
import { Identifier } from 'src/__shared__/identifier';
import { TeamNameVO } from 'src/domain/team/team-name-vo';

jest.mock('@prisma/client');
jest.mock('src/infra/db/repository/team-repository');

describe('【ユースケース】チームの更新', () => {
  let mockTeamRepository: MockedObjectDeep<TeamRepository>;

  beforeAll(() => {
    const prisma = new PrismaClient();
    mockTeamRepository = mocked(new TeamRepository(prisma), true);
  });

  it('【正常系】チーム名を変更できる', async () => {
    const id = Identifier.generator();
    const name = new TeamNameVO('5');

    const team = new Team({
      id: id,
      name: name,
      pairList: [],
    });

    mockTeamRepository.getById.mockResolvedValueOnce(team);
    const updateTeam = new Team({ id: id, name: name, pairList: [] });
    updateTeam.name.setValue('6');
    mockTeamRepository.update.mockResolvedValueOnce(updateTeam);

    const usecase = new UpdateTeamUseCase(mockTeamRepository);
    return await expect(usecase.execute({ id: id, name: '5' })).resolves.toBe(
      updateTeam
    );
  });
});
