import { Repository } from 'typeorm';
import type { FindOneOptions } from 'typeorm';
export class PaginationResult<T> {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPage: number;
  isEnd: boolean;
  list: T[];
}
export class PaginationService<T> {
  constructor(private repository: Repository<T>) {}

  async paginate(params: {
    page: number;
    pageSize: number;
    options?: FindOneOptions<T>;
  }): Promise<PaginationResult<T>> {
    const { page, pageSize, options = {} } = params;
    const [result, total] = await this.repository.findAndCount({
      take: pageSize,
      skip: pageSize * (page - 1),
      ...options,
    });

    const paginationResult = new PaginationResult<T>();
    paginationResult.list = result;
    paginationResult.total = total;
    paginationResult.pageSize = pageSize;
    paginationResult.currentPage = page;
    paginationResult.totalPage = Math.ceil(total / pageSize);
    paginationResult.isEnd = paginationResult.totalPage === page;

    return paginationResult;
  }
}
