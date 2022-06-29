import { PrismaClient } from '@prisma/client';
import { Identifier } from 'src/__shared__/identifier';
import { Team } from 'src/domain/team';
import { TeamNameVO } from 'src/domain/team-name-vo';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { mocked } from 'ts-jest/utils';
import { UpdateTeamUseCase } from '../update-team-usecase';

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
    const newTeam = updateTeam.updateName('6');
    mockTeamRepository.update.mockResolvedValueOnce(newTeam);

    const usecase = new UpdateTeamUseCase(mockTeamRepository);
    return await expect(usecase.execute({ id: id, name: '5' })).resolves.toBe(
      newTeam
    );
  });
});
