import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { DeleteTaskUseCase } from 'src/app/delete-task-usecase';
import { UpdateTaskStatusUseCase } from 'src/app/update-task-status-usecase';
import { Progress } from 'src/domain/progress/progress';
import { Task } from 'src/domain/task/task';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { PutTaskRequest } from './request/put-task-request';

@Controller({
  path: '/tasks',
})
export class TaskController {
  @Put('/:id')
  @ApiResponse({ status: 200, type: Task })
  async PutTask(
    @Param('id') id: string,
    @Body() putTaskDTO: PutTaskRequest
  ): Promise<Progress | null> {
    const prisma = new PrismaClient();
    const progressRepository = new ProgressRepository(prisma);
    const usecase = new UpdateTaskStatusUseCase(progressRepository);

    const task = await usecase.execute({
      memberId: putTaskDTO.memberId,
      taskId: id,
    });
    return task;
  }

  @Delete('/:id')
  @ApiResponse({ status: 200 })
  async deleteTask(@Param('id') id: string): Promise<Task> {
    const prisma = new PrismaClient();
    const taskRepository = new TaskRepository(prisma);
    const usecase = new DeleteTaskUseCase(prisma, taskRepository);
    const task = await usecase.execute({ taskId: id });
    return task;
  }
}
