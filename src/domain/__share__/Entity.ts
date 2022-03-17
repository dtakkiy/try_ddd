import { Identifier } from 'src/__share__/identifier';

export abstract class Entity<T> {
  protected readonly _id: Identifier;
  protected props: T;

  public constructor(props: T, id?: Identifier) {
    this._id = id ? id : new Identifier();
    this.props = props;
  }

  public get id(): Identifier {
    return this._id;
  }

  public equals = (object?: Entity<T>): boolean => {
    if (object == null || object == undefined) {
      return false;
    }

    return this._id === object?._id;
  };
}
