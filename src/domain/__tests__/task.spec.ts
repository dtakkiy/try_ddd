import { Task } from '../task/task';
import * as faker from 'faker';

describe('taskの単体テスト', () => {
  it('インスタンスを生成できる', () => {
    const data = {
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      content: faker.name.jobDescriptor(),
    };
    const task = new Task(data);
    expect(task).toBeInstanceOf(Task);
  });

  it('属性を取得できる', () => {
    const taskId = faker.datatype.uuid();
    const data = {
      id: taskId,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task = new Task(data);
    expect(task).toBeInstanceOf(Task);

    expect(task.id).toBe(taskId);
    expect(task.title).toMatch(/サンプルタイトル/);
    expect(task.content).toMatch(/本文/);
  });
});
