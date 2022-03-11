import { PrismaClient } from '@prisma/client';
import {
  SomeDataDTO,
  ISomeDataQS,
} from 'src/app/sample/query-service-interface/some-data-qs';

export class SomeDataQS implements ISomeDataQS {
  private prismaClient: PrismaClient;
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<SomeDataDTO[]> {
    const allSomeDatas = await this.prismaClient.someData.findMany();
    return allSomeDatas.map(
      (someDataDM) =>
        new SomeDataDTO({
          ...someDataDM,
        })
    );
  }
}
