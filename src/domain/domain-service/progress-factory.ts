import { Member } from '../member';
import { Progress } from '../progress';
import { ProgressStatusVO, ProgressStatusType } from '../progress-status-vo';
import { Task } from '../task';

interface IProps {
  member: Member;
  taskList: Task[] | null;
}

export class ProgressFactory {
  public static execute = (props: IProps): Progress[] | null => {
    if (props.taskList === null) {
      return null;
    }

    return props.taskList.map((task) => {
      const memberId = props.member.id;
      const taskId = task.id;
      const status = new ProgressStatusVO(ProgressStatusType.notStarted);

      return new Progress({ memberId, taskId, status });
    });
  };
}
