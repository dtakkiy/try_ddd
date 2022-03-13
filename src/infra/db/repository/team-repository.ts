import { PrismaClient } from '@prisma/client';
import { Pair } from 'src/domain/team/pair';
import { Team } from 'src/domain/team/team';
import { ITeamRepository } from 'src/domain/team/team-repository-interface';

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient;
  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public getAll = async (): Promise<Team[] | null> => {
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
  };
}
