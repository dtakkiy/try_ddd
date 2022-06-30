import { Identifier } from 'src/__shared__/identifier';
import { DSError, Result } from 'src/__shared__/result';
import { Pair } from '../pair';
import { PairNameVO } from '../pair-name-vo';

interface IProps {
  id: string;
  name: string;
  memberIdList: string[];
}

export class PairFactory {
  public static execute = (props: IProps): Result<Pair, DSError> => {
    const { memberIdList } = props;
    const id = props.id ?? Identifier.generator();
    const name = new PairNameVO(props.name);

    return Pair.create({ id, name, memberIdList });
  };
}
