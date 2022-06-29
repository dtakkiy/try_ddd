import { ApiProperty } from '@nestjs/swagger';
import { Page, Paging } from 'src/__shared__/page';
import { DomainError, Result } from 'src/__shared__/result';
import { SearchDTO } from 'src/app/query-service-interface/search-task-query-service';

export class GetSearchResponse {
  @ApiProperty({ type: () => [SearchData] })
  searchData: SearchData[] = [];
  pagingData: Paging = {
    totalCount: 0,
    pageNumber: 0,
    pageSize: 0,
  };
  errorData = '';

  public constructor(params: {
    searchDatas: Result<Page<SearchDTO>, DomainError>;
  }) {
    const { searchDatas } = params;

    if (searchDatas.isSuccess()) {
      this.pagingData = searchDatas.value.paging;
      this.searchData = searchDatas.value.items.map(
        ({ id, name, email }: { id: string; name: string; email: string }) => {
          return new SearchData({
            id,
            name,
            email,
          });
        }
      );
    }

    if (searchDatas.isFailure()) {
      this.errorData = searchDatas.value;
    }
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
