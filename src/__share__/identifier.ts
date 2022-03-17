import { v4 as uuidv4 } from 'uuid';

interface IIdentifier {
  _id: string;
}

export class Identifier {
  private readonly props: IIdentifier;

  public constructor(id?: string) {
    this.props = {
      _id: id ?? uuidv4(),
    };
  }

  public get id() {
    return this.props._id;
  }

  public equals(id: Identifier): boolean {
    return this.props._id === id.props._id;
  }

  public static generator() {
    return uuidv4();
  }
}
