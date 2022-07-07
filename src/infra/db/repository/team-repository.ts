import { PrismaClient } from '@prisma/client';
import { Pair } from 'src/domain/pair';
import { PairNameVO } from 'src/domain/pair-name-vo';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository-interface';
import { Team } from 'src/domain/team';
import { TeamNameVO } from 'src/domain/team-name-vo';

export class TeamRepository implements ITeamRepository {
  constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<Team[] | null> {
    const allTeam = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!allTeam) {
      return null;
    }

    const pairLists: Pair[] = [];

    return allTeam.map((teamDM) => {
      teamDM.pairs.map((pair) => {
        const p = Pair.reconstruct({
          id: pair.id,
          name: new PairNameVO(pair.name),
          memberIdList: pair.members.map((member) => {
            return member.id;
          }),
        });

        pairLists.push(p);
      });

      return Team.reconstruct({
        id: teamDM.id,
        name: new TeamNameVO(teamDM.name),
        pairList: pairLists,
      });
    });
  }

  public async getByMemberId(memberId: string): Promise<Team | null> {
    const pairOnMember = await this.prismaClient.member.findMany({
      where: {
        id: memberId,
      },
    });

    if (!pairOnMember) {
      return null;
    }

    let pairId: string | undefined = '';
    if (pairOnMember.length > 0) {
      pairId = pairOnMember[0]?.pairId;
    }

    if (!pairId) {
      return null;
    }

    const pair = await this.prismaClient.pair.findFirst({
      include: {
        team: {
          select: {
            id: true,
            name: true,
            pairs: true,
          },
        },
      },
      where: {
        id: pairId,
      },
    });

    if (!pair) {
      return null;
    }

    return Team.reconstruct({
      id: pair.team.id,
      name: new TeamNameVO(pair.team.name),
      pairList: pair.team.pairs.map((pair) => {
        return Pair.reconstruct({
          id: pair.id,
          name: new PairNameVO(pair.name),
          memberIdList: pairOnMember.map((member) => member.id),
        });
      }),
    });
  }

  public async getByPairId(pairId: string): Promise<Team | null> {
    const pair = await this.prismaClient.pair.findUnique({
      include: {
        team: true,
      },
      where: {
        id: pairId,
      },
    });

    if (!pair) {
      return null;
    }

    const team = await this.prismaClient.team.findUnique({
      include: {
        pairs: {
          select: {
            id: true,
            name: true,
            members: true,
          },
        },
      },
      where: {
        id: pair.id,
      },
    });

    if (!team) {
      return null;
    }

    return Team.reconstruct({
      id: team.id,
      name: new TeamNameVO(team.name),
      pairList: team.pairs.map((pair) =>
        Pair.reconstruct({
          id: pair.id,
          name: new PairNameVO(pair.name),
          memberIdList: pair.members.map((member) => member.id),
        })
      ),
    });
  }

  public async update(team: Team): Promise<Team | null> {
    const currentTeam = await this.getById(team.id);

    if (currentTeam === null) {
      return null;
    }

    const { id, pairList } = currentTeam.getAllProperties();
    const { name } = team.getAllProperties();

    await this.updateTeamPair(currentTeam, team);

    return Team.reconstruct({
      name: new TeamNameVO(name),
      id: id,
      pairList: pairList,
    });
  }

  private async updateTeamPair(currentTeam: Team, team: Team): Promise<void> {
    const { id, pairList } = currentTeam.getAllProperties();

    const { name } = team.getAllProperties();

    let arr: any;

    const teamUpdate = this.prismaClient.team.update({
      where: {
        id: currentTeam.id,
      },
      data: {
        name: name,
      },
    });

    const pairUpdateList = pairList.map((pair) => {
      const { name } = pair.getAllProperties();

      return this.prismaClient.pair.upsert({
        where: {
          id: pair.id,
        },
        update: {
          teamId: id,
        },
        create: {
          id: pair.id,
          teamId: id,
          name: name,
        },
      });
    });

    arr.push(teamUpdate);
    arr.push(pairUpdateList);

    try {
      await this.prismaClient.$transaction(arr);
    } catch (err: any) {
      // rollback ??
      throw new Error('update team pair failure.');
    } finally {
      this.prismaClient.$disconnect();
    }
  }

  private async updateTeam(currentTeam: Team, team: Team): Promise<void> {
    const { name } = team.getAllProperties();

    await this.prismaClient.team.update({
      where: {
        id: currentTeam.id,
      },
      data: {
        name: name,
      },
    });
  }

  public async getById(teamId: string): Promise<Team | null> {
    const team = await this.prismaClient.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        pairs: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!team) {
      return null;
    }

    return Team.reconstruct({
      id: team.id,
      name: new TeamNameVO(team.name),
      pairList: team.pairs.map((pair) =>
        Pair.reconstruct({
          id: pair.id,
          name: new PairNameVO(pair.name),
          memberIdList: pair.members.map((member) => member.id),
        })
      ),
    });
  }
}
