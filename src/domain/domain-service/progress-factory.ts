import { Member } from '../member';
import { Task } from '../task';
import { Progress } from '../progress';
import { ProgressStatus, ProgressStatusType } from '../progress-status-vo';

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
      const status = new ProgressStatus(ProgressStatusType.notStarted);

      return new Progress({ memberId, taskId, status });
    });
  };
}
