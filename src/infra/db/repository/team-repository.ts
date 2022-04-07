import { PrismaClient } from '@prisma/client';
import { Pair } from 'src/domain/team/pair';
import { PairNameVO } from 'src/domain/team/pair-name-vo';
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
            members: true,
          },
        },
      },
    });

    return null;
  }

  // public async getPairIdByMemberId(memberId: string): Promise<Pair | null> {
  //   const pairOnMember = await this.prismaClient.member.findMany({
  //     where: {
  //       id: memberId,
  //     },
  //   });

  //   if (!pairOnMember) {
  //     return null;
  //   }

  //   let pairId: string | undefined = '';
  //   if (pairOnMember.length > 0) {
  //     pairId = pairOnMember[0]?.pairId;
  //   }

  //   if (!pairId) {
  //     return null;
  //   }

  //   const pair = await this.prismaClient.pair.findFirst({
  //     include: {
  //       team: {
  //         select: {
  //           id: true,
  //           name: true,
  //           pairs: true,
  //         },
  //       },
  //     },
  //     where: {
  //       id: pairId,
  //     },
  //   });

  //   if (!pair) {
  //     return null;
  //   }

  //   return new Pair({
  //     id: pair.id,
  //     name: new PairNameVO(pair.name),
  //     memberIdList: pairOnMember.map((member) => member.id),
  //   });
  // }

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

    return new Team({
      id: pair.team.id,
      name: new TeamNameVO(pair.team.name),
      pairList: pair.team.pairs.map(
        (pair) =>
          new Pair({
            id: pair.id,
            name: new PairNameVO(pair.name),
            memberIdList: pairOnMember.map((member) => member.id),
          })
      ),
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

    return new Team({
      id: team.id,
      name: new TeamNameVO(team.name),
      pairList: team.pairs.map(
        (pair) =>
          new Pair({
            id: pair.id,
            name: new PairNameVO(pair.name),
            memberIdList: pair.members.map((member) => member.id),
          })
      ),
    });
  }

  public async update(team: Team): Promise<Team> {
    const currentTeam = await this.getById(team.id);

    if (currentTeam === null) {
      throw new Error('the specified team does not exist.');
    }

    const { id, pairList } = currentTeam.getAllProperties();

    await this.updateTeamPair(currentTeam, team);

    return new Team({ name: team.name, id: id, pairList: pairList });
  }

  private async updateTeamPair(currentTeam: Team, team: Team): Promise<void> {
    const { id, pairList } = currentTeam.getAllProperties();

    let arr: any;

    const teamUpdate = this.prismaClient.team.update({
      where: {
        id: currentTeam.id,
      },
      data: {
        name: team.name.getValue(),
      },
    });

    const pairUpdateList = pairList.map((pair) => {
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
          name: pair.name.getValue(),
        },
      });
    });

    arr.push(teamUpdate);
    arr.push(pairUpdateList);

    try {
      await this.prismaClient.$transaction(arr);
    } catch (err: any) {
      // rollback ??
      throw new Error('update failure.');
    } finally {
      this.prismaClient.$disconnect();
    }
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

    return new Team({
      id: team.id,
      name: new TeamNameVO(team.name),
      pairList: team.pairs.map(
        (pair) =>
          new Pair({
            id: pair.id,
            name: new PairNameVO(pair.name),
            memberIdList: pair.members.map((member) => member.id),
          })
      ),
    });
  }
}
