import { PrismaClient } from '@prisma/client';
import { ISomeDataRepository } from 'src/app/sample/repository-interface/some-data-repository';
import { SomeData } from 'src/domain/sample/entity/some-data';

export class SomeDataRepository implements ISomeDataRepository {
  private prismaClient: PrismaClient;
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async save(someDataEntity: SomeData): Promise<SomeData> {
    const { id, required, number } = someDataEntity.getAllProperties();

    const savedSomeDataDatamodel = await this.prismaClient.someData.create({
      data: {
        id,
        required,
        number,
      },
    });
    const savedSomeDataEntity = new SomeData({
      ...savedSomeDataDatamodel,
    });
    return savedSomeDataEntity;
  }
}
