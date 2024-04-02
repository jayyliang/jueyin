import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, SearchParams } from 'meilisearch';
@Injectable()
export class MeiliSearchService {
  private readonly client: MeiliSearch;
  constructor() {
    const configService = new ConfigService();
    const host = configService.get<string>(
      'MEILI_HOST',
      'http://localhost:7700',
    );
    const apiKey = configService.get<string>('MEILI_MASTER_KEY', 'master_key');
    this.client = new MeiliSearch({
      host,
      apiKey,
      requestConfig: {
        headers: {
          'X-MEILI-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      },
    });
  }

  async search(indexName: string, query: string, options: SearchParams) {
    return await this.client.index(indexName).search(query, options);
  }
  async addDocument(indexName: string, documents: Record<string, any>[]) {
    return await this.client.index(indexName).addDocuments(documents);
  }
}
