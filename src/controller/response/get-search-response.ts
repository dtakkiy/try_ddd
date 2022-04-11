import { ApiProperty } from '@nestjs/swagger';
import { SearchDTO } from 'src/app/query-service-interface/search-task-query-service';
import { Page } from 'src/domain/__shared__/Page';
export class GetSearchResponse {
  @ApiProperty({ type: () => [SearchData] })
  searchData: SearchData[];

  public constructor(params: { searchDatas: SearchDTO[] }) {
    const { searchDatas } = params;
    this.searchData = searchDatas.map(({ id, name, email }) => {
      return new SearchData({
        id,
        name,
        email,
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

  public constructor(params: { id: string; name: string; email: string }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
  }
}
