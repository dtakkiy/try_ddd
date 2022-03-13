import { Identifier } from 'src/__share__/identifier';
import { MemberStatus } from './member-status';

interface IMember {
  id: string;
  name: string;
  email: string;
  status: MemberStatus;
}

export class Member {
  private props: IMember;
  constructor(props: IMember) {
    this.props = {
      ...props,
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

  private static validateName(name: string) {
    if (name === '') {
      throw new Error('');
    }
  }

  private static validateEmail(email: string) {
    if (email === '') {
      throw new Error('');
    }
  }

  public static create(props: IMember): Member {
    this.validateName(props.name);
    this.validateEmail(props.email);

    return new Member(props);
  }

  public equals = (member: Member): boolean => {
    return member.props.id === this.props.id;
  };
}
