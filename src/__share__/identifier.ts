import { v4 as uuidv4 } from 'uuid';

export class Identifier {
  public static generator() {
    return uuidv4();
  }
}
