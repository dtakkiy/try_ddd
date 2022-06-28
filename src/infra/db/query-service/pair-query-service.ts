import { PrismaClient } from '@prisma/client';
import {
  PairDTO,
  IPairQueryService,
} from 'src/app/query-service-interface/pair-query-service';

export class PairQueryService implements IPairQueryService {
  public constructor(private readonly prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<PairDTO[]> {
    const allPairs = await this.prismaClient.pair.findMany({
      include: {
        members: true,
      },
    });

    const pairList: PairDTO[] = allPairs.map((pairDM) => {
      return {
        id: pairDM.id,
        name: pairDM.name,
        members: pairDM.members.map((member) => member.id),
      };
    });

    return pairList;
  }
}
