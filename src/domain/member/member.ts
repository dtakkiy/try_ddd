import { Identifier } from 'src/__share__/identifier';
import { MemberEmailVO } from './member-email-vo';
import { MemberNameVO } from './member-name-vo';
import { MemberStatus, MemberStatusType } from './member-status';

interface IMember {
  id: string;
  name: MemberNameVO;
  email: MemberEmailVO;
  status: MemberStatus;
}

export class Member {
  private props: IMember;
  constructor(props: IMember) {
    const { id, name, email, status } = props;
    this.validateStatus(props.status.getStatus());

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
      name: this.props.name,
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

  public setEmail(email: string) {
    this.props.email.setEmail(email);
  }

  public setStatus(status: MemberStatus) {
    this.props.status = status;
  }

  public setName(name: string) {
    this.props.name.setValue(name);
  }

  private validateStatus(status: string) {
    if (Object.values(MemberStatusType).includes(status) === false) {
      throw new Error(`not applicable member status value. ${status}`);
    }
  }

  public equals = (member: Member): boolean => {
    return member.props.id === this.props.id;
  };
}
