import { ApiProperty } from '@nestjs/swagger';
import { SearchDTO } from 'src/app/query-service-interface/search-task-query-service';
export class GetSearchResponse {
  @ApiProperty({ type: () => [SearchData] })
  searchData: SearchData[];

  public constructor(params: { searchDatas: SearchDTO[] }) {
    const { searchDatas } = params;
    this.searchData = searchDatas.map(({ id, name, email, status }) => {
      return new SearchData({
        id,
        name,
        email,
        status,
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

  @ApiProperty()
  status: string;

  public constructor(params: {
    id: string;
    name: string;
    status: string;
    email: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.email = params.email;
    this.status = params.status;
  }
}
