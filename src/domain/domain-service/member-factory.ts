import { Identifier } from 'src/__shared__/identifier';
import { Member } from '../member';
import { MemberEmailVO } from '../member-email-vo';
import { MemberNameVO } from '../member-name-vo';
import { MemberStatusVO } from '../member-status-vo';

interface IProps {
  id?: string;
  name: string;
  email: string;
  status?: string;
}

export class MemberFactory {
  public static execute = (props: IProps): Member | null => {
    const id = props.id ?? Identifier.generator();
    const name = new MemberNameVO(props.name);
    const email = new MemberEmailVO(props.email);
    const status = MemberStatusVO.create();

    const member = Member.create({ id, name, email, status });

    if (member.isFailure()) {
      return null;
    }

    return member.value;
  };
}
