import { Member } from '../member/member';
import { Task } from '../task/task';
import { Progress } from './progress';
import { ProgressStatus } from './progress-status';

interface IProps {
  member: Member;
  taskList: Task[];
}

export class ProgressFactory {
  public static execute = (props: IProps): Progress[] => {
    return props.taskList.map((task) => {
      const memberId = props.member.id;
      const taskId = task.id;
      const status = ProgressStatus.create({ status: '未着手' });

      return Progress.create({ memberId, taskId, status });
    });
  };
}
