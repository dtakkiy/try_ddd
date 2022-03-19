import { PrismaClient } from '@prisma/client';
import {
  PairDTO,
  IPairQueryService,
} from 'src/app/query-service-interface/pair-query-service';

export class PairQueryService implements IPairQueryService {
  private prismaClient: PrismaClient;
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<PairDTO[]> {
    const allPairs = await this.prismaClient.pair.findMany({
      include: {
        PairOnMember: {},
      },
    });

    const pairList: PairDTO[] = allPairs.map((pairDM) => {
      return {
        id: pairDM.id,
        name: pairDM.name,
        members: pairDM.PairOnMember.map((member) => member.memberId),
      };
    });

    return pairList;
  }
}
