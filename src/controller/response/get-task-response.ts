import { ApiProperty } from '@nestjs/swagger';
import { TaskDTO } from 'src/app/query-service-interface/task-query-service';
export class GetTaskResponse {
  @ApiProperty({ type: () => [TaskData] })
  taskDatas: TaskData[];

  public constructor(params: { taskDatas: TaskDTO[] }) {
    const { taskDatas } = params;
    this.taskDatas = taskDatas.map(({ id, title, content }) => {
      return new TaskData({
        id,
        title,
        content,
      });
    });
  }
}

class TaskData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: any;

  public constructor(params: { id: string; title: string; content: any }) {
    this.id = params.id;
    this.title = params.title;
    this.content = params.content;
  }
}
