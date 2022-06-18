import { ApiProperty } from '@nestjs/swagger';
import { SearchDTO } from 'src/app/query-service-interface/search-task-query-service';

import { Page, Paging } from 'src/domain/__shared__/page';

export class GetSearchResponse {
  @ApiProperty({ type: () => [SearchData] })
  searchData: SearchData[];
  pagingData: Paging = {
    totalCount: 0,
    pageNumber: 0,
    pageSize: 0,
  };

  public constructor(params: { searchDatas: Page<SearchDTO> }) {
    const { searchDatas } = params;
    this.pagingData = searchDatas.paging;
    this.searchData = searchDatas.items.map(
      ({ id, name, email }: { id: string; name: string; email: string }) => {
        return new SearchData({
          id,
          name,
          email,
        });
      }
    );
  }
}

class SearchData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  public constructor(params: { id: string; name: string; email: string }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
  }
}
