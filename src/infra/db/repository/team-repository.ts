import { PrismaClient } from '@prisma/client';
import { Member } from 'src/domain/member/member';
import { Pair } from 'src/domain/team/pair';
import { Team } from 'src/domain/team/team';
import { TeamNameVO } from 'src/domain/team/team-name-vo';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<Team[] | null> {
    const allTeam = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          include: {
            PairOnMember: true,
          },
        },
      },
    });

    return null;
  }

  public async update(team: Team): Promise<Team> {
    const currentTeam = await this.getById(team.id);

    if (currentTeam === null) {
      throw new Error('the specified team does not exist.');
    }

    await this.updateTeam(currentTeam, team);
    // pairと pairOnMemberテーブルの更新も必要

    const { id, pairList } = currentTeam.getAllProperties();

    return new Team({ name: team.name, id: id, pairList: pairList });
  }

  private async updateTeam(currentTeam: Team, team: Team): Promise<void> {
    await this.prismaClient.team.update({
      where: {
        id: currentTeam.id,
      },
      data: {
        name: team.name.getValue(),
      },
    });
  }

  public async getById(id: string): Promise<Team | null> {
    const team = await this.prismaClient.team.findUnique({
      where: {
        id: id,
      },
      include: {
        pairs: {
          include: {
            PairOnMember: {
              include: {
                member: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    return new Team({
      id: team.id,
      name: new TeamNameVO(team.name),
      pairList: [],
    });
  }
}
