import { Progress } from 'src/domain/progress';
import { IProgressRepository } from 'src/domain/repository-interface/progress-repository-interface';

interface Params {
  memberId: string;
  taskId: string;
}

export class UpdateTaskStatusUseCase {
  constructor(private readonly progressRepository: IProgressRepository) {
    this.progressRepository = progressRepository;
  }

  public execute = async (params: Params): Promise<Progress | null> => {
    const { memberId, taskId } = params;

    const progress = await this.progressRepository.getById({
      memberId: memberId,
      taskId: taskId,
    });

    if (!progress) {
      return null;
    }

    // 進捗ステータスを進める
    progress.changeStatusForward(memberId);

    const updateProgress = await this.progressRepository.update(
      memberId,
      taskId,
      progress.status
    );

    return updateProgress;
  };
}
