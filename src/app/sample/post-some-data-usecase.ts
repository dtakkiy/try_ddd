import { SomeData } from 'src/domain/sample/entity/some-data';
import { createRandomIdString } from 'src/util/random';
import { ISomeDataRepository } from './repository-interface/some-data-repository';

export class PostSomeDataUseCase {
  private readonly someDataRepo: ISomeDataRepository;
  public constructor(someDataRepo: ISomeDataRepository) {
    this.someDataRepo = someDataRepo;
  }
  public async do(params: { required: boolean; number: number }) {
    const { required, number } = params;

    const someDataEntity = new SomeData({
      id: createRandomIdString(),
      required,
      number,
    });
    await this.someDataRepo.save(someDataEntity);
  }
}
