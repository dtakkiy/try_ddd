import { v4 as uuidv4 } from 'uuid';

interface IIdentifier {
  value: string;
}

export class Identifier {
  private readonly props: IIdentifier;

  public constructor(id?: string) {
    this.props = {
      value: id ?? uuidv4(),
    };
  }

  public get id() {
    return this.props.value;
  }

  public isEqual(id: Identifier): boolean {
    return this.props.value === id.props.value;
  }

  public static generator() {
    return uuidv4();
  }
}
