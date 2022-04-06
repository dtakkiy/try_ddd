import { ApiProperty } from '@nestjs/swagger';
import { SearchDTO } from 'src/app/query-service-interface/search-task-query-service';
import { Page } from 'src/domain/__shared__/Page';
export class GetSearchResponse {
  @ApiProperty({ type: () => [SearchData] })
  searchData: SearchData[];

  public constructor(params: { searchDatas: Page<SearchDTO> }) {
    const { searchDatas } = params;
    this.searchData = searchDatas.items.map(({ id, name, email }) => {
      return new SearchData({
        id,
        name,
        email,
        // taskId,
        // title,
        // status,
      });
    });
  }
}

class SearchData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  // @ApiProperty()
  // taskId: string;

  // @ApiProperty()
  // title: string;

  // @ApiProperty()
  // status: string;

  public constructor(params: {
    id: string;
    name: string;
    //    status: string;
    // taskId: string;
    // title: string;
    email: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    // this.taskId = params.taskId;
    // this.title = params.title;
    // this.status = params.status;
  }
}
