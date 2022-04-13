import { Body, Controller, Get, Delete, Param, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTaskUseCase } from 'src/app/get-task-usecae';
import { UpdateTaskStatusUseCase } from 'src/app/update-task-status-usecase';
import { Progress } from 'src/domain/progress';
import { Task } from 'src/domain/task';
import { TaskQueryService } from 'src/infra/db/query-service/task-query-service';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
import { TaskRepository } from 'src/infra/db/repository/task-repository';
import { PutTaskRequest } from './request/put-task-request';
import { GetTaskResponse } from './response/get-task-response';
import { DeleteTaskUseCase } from 'src/app/delete-task-usecase';

@Controller({
  path: '/tasks',
})
export class TaskController {
  @Get()
  @ApiResponse({ status: 200, type: GetTaskResponse })
  async getTask(): Promise<GetTaskResponse> {
    const prisma = new PrismaClient();
    const qs = new TaskQueryService(prisma);
    const usecase = new GetTaskUseCase(qs);
    const result = await usecase.execute();
    const response = new GetTaskResponse({ taskDatas: result });
    return response;
  }

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
