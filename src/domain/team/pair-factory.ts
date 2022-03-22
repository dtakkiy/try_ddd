import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { Pair } from './pair';
import { PairNameVO } from './pair-name-vo';

interface IProps {
  id: string;
  name: string;
  memberList: Member[];
}

export class PairFactory {
  public static execute = (props: IProps): Pair => {
    const { memberList } = props;
    const id = props.id ?? Identifier.generator();
    const name = new PairNameVO(props.name);

    return new Pair({ id, name, memberList });
  };
}
