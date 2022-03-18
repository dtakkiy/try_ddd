import { Identifier } from 'src/__share__/identifier';
import { Member } from './member';
import { MemberEmailVO } from './member-email-vo';
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
    const { name } = props;
    const email = new MemberEmailVO(props.email);
    const status = MemberStatus.create();

    return new Member({ id, name, email, status });
  };
}
