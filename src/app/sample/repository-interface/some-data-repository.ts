import { SomeData } from 'src/domain/sample/entity/some-data';

export interface ISomeDataRepository {
  save(someData: SomeData): Promise<SomeData>;
}
