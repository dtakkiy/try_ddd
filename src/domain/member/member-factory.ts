import { Identifier } from 'src/__share__/identifier';
import { Member } from './member';
import { MemberStatus } from './member-status';

interface IProps {
  id?: string;
  name: string;
  email: string;
  status?: string;
}

export class MemberFactory {
  public static execute = (props: IProps): Member => {
    const id = props.id ?? Identifier.generator();
    const { name, email } = props;
    const status = MemberStatus.create();

    return Member.create({ id, name, email, status });
  };
}
