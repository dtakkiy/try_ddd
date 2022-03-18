import { Identifier } from 'src/__share__/identifier';
import { MemberEmailVO } from './member-email-vo';
import { MemberStatus, MemberStatusType } from './member-status';

interface IMember {
  id: string;
  name: string;
  email: MemberEmailVO;
  status: MemberStatus;
}

export class Member {
  private props: IMember;
  constructor(props: IMember) {
    const { id, name, email, status } = props;
    this.validateName(props.name);
    //    this.validateEmail(props.email);
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
    this.props.name = name;
  }

  private validateStatus(status: string) {
    if (Object.values(MemberStatusType).includes(status) === false) {
      throw new Error(`not applicable member status value. ${status}`);
    }
  }

  private validateName(name: string) {
    if (name === '') {
      throw new Error('name is empty.');
    }
  }

  private validateEmail(email: string) {
    if (email === '') {
      throw new Error('email is empty.');
    }
  }

  public equals = (member: Member): boolean => {
    return member.props.id === this.props.id;
  };
}
