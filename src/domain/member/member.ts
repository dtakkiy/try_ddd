import { Identifier } from 'src/__share__/identifier';
import { MemberStatus, MemberStatusType } from './member-status';

interface IMember {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
}

export class Member {
  private props: IMember;
  constructor(props: IMember) {
    const { id, name, email, status } = props;
    this.validateName(props.name);
    this.validateEmail(props.email);
    this.validateStatus(props.status.props.status);

    this.props = {
      id: id ?? Identifier.generator(),
      name: name,
      email: email,
      status: status,
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
    this.props.email = email;
  }

  public setStatus(status: MemberStatus) {
    this.props.status = status;
  }

  public setName(name: string) {
    this.props.name = name;
  }

  private validateStatus(status: string) {
    if (status in MemberStatusType) {
    } else {
      throw new Error();
    }
  }

  private validateName(name: string) {
    if (name === '') {
      throw new Error('');
    }
  }

  private validateEmail(email: string) {
    if (email === '') {
      throw new Error('');
    }
  }

  public equals = (member: Member): boolean => {
    return member.props.id === this.props.id;
  };
}
