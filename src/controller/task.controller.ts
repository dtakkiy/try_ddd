import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { UpdateTaskStatusUseCase } from 'src/app/update-task-status-usecase';
import { Progress } from 'src/domain/progress/progress';
import { Task } from 'src/domain/task/task';
import { ProgressRepository } from 'src/infra/db/repository/progress-repository';
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
}
