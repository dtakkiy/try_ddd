import { Identifier } from 'src/__shared__/identifier';
import { Pair } from '../pair';
import { Team } from '../team';
import { TeamNameVO } from '../team-name-vo';

interface IProps {
  id: string;
  name: string;
  pairList: Pair[];
}

export class TeamFactory {
  public static execute = (props: IProps): Team | null => {
    const { pairList } = props;
    const id = Identifier.generator();
    const team = Team.create({
      id: id,
      name: new TeamNameVO(props.name),
      pairList,
    });

    if (team.isFailure()) {
      return null;
    }

    return team.value;
  };
}
