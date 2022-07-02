import * as faker from 'faker';
import { Task } from '../task';

describe('taskの単体テスト', () => {
  let data = { id: '', title: '', content: '' };

  beforeEach(() => {
    data = {
      id: faker.datatype.uuid(),
      title: faker.name.jobTitle(),
      content: faker.name.jobDescriptor(),
    };
  });

  it('インスタンスを生成できる', () => {
    const task1 = Task.create(data);
    if (task1 === null) {
      return;
    }
    expect(task1).toBeInstanceOf(Task);
  });

  it('属性を取得できる', () => {
    const taskId = faker.datatype.uuid();
    const data = {
      id: taskId,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task1 = Task.reconstruct(data);
    const { id, title, content } = task1.getAllProperties();

    expect(task1).toBeInstanceOf(Task);
    expect(id).toBe(taskId);
    expect(title).toMatch(/サンプルタイトル/);
    expect(content).toMatch(/本文/);
  });

  it('同一のエンティティか判定する', () => {
    const taskId1 = faker.datatype.uuid();
    const data1 = {
      id: taskId1,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task1 = Task.create(data1);
    if (task1 === null) {
      return;
    }

    const taskId2 = faker.datatype.uuid();
    const data2 = {
      id: taskId2,
      title: 'サンプルタイトル',
      content: '本文',
    };

    const task2 = Task.create(data2);
    if (task2 === null) {
      return;
    }

    expect(task1.isEqual(task1)).toBeTruthy();
    expect(task1.isEqual(task2)).not.toBeTruthy();
  });
});
