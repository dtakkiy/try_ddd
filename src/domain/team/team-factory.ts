import { Identifier } from 'src/__share__/identifier';
import { Pair } from './pair';
import { Team } from './team';
import { TeamNameVO } from './team-name-vo';

interface IProps {
  id: string;
  name: string;
  pairList: Pair[];
}

export class TeamFactory {
  public static execute = (props: IProps): Team => {
    const { pairList } = props;
    const id = Identifier.generator();
    return new Team({ id: id, name: new TeamNameVO(props.name), pairList });
  };
}
