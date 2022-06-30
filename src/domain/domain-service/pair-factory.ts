import { Identifier } from 'src/__shared__/identifier';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';

interface IProps {
  id: string;
  name: string;
  memberIdList: string[];
}

export class PairFactory {
  public static execute = (props: IProps): Pair | null => {
    const { memberIdList } = props;
    const id = props.id ?? Identifier.generator();
    const name = new PairNameVO(props.name);

    return Pair.create({ id, name, memberIdList });
  };
}
