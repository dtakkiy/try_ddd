import { Identifier } from 'src/__share__/identifier';
import { Member } from '../member/member';
import { Pair } from './pair';

interface IProps {
  id: string;
  name: string;
  memberList: Member[];
}

export class PairFactory {
  public static execute = (props: IProps): Pair => {
    const { name, memberList } = props;
    const id = props.id ?? Identifier.generator();

    return new Pair({ id, name, memberList });
  };
}
