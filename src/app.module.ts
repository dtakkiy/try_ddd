import { Module } from '@nestjs/common';
import { MemberController } from './controller/member.controller';
import { PairController } from './controller/pair.controller';
import { SearchController } from './controller/search.controller';
import { TaskController } from './controller/task.controller';
import { TeamController } from './controller/team.controller';

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [
    MemberController,
    TeamController,
    PairController,
    TaskController,
    SearchController,
  ],
  providers: [],
})
export class AppModule {}
