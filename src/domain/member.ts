import { Identifier } from 'src/__shared__/identifier';
import { MemberEmailVO } from './member-email-vo';
import { MemberNameVO } from './member-name-vo';
import { MemberStatusVO } from './member-status-vo';

interface IMember {
  id: string;
  name: MemberNameVO;
  email: MemberEmailVO;
  status: MemberStatusVO;
}

export class Member {
  private props: IMember;
  constructor(props: IMember) {
    const { id, name, email, status } = props;

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      email: email,
      status: status,
    };
  }

  public getAllProperties() {
    return {
      id: this.props.id,
      name: this.props.name.getValue(),
      email: this.props.email.getEmail(),
      status: this.props.status.getStatus(),
    };
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get status() {
    return this.props.status;
  }

  public setStatus(newStatus: MemberStatusVO): Member {
    const { id, name, email } = this.getAllProperties();

    return new Member({
      id: id,
      name: new MemberNameVO(name),
      email: new MemberEmailVO(email),
      status: newStatus,
    });
  }

  public equals = (member: Member): boolean => {
    return member.props.id === this.props.id;
  };
}
