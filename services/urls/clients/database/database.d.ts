import { type FastifyReply, type FastifyPluginAsync } from 'fastify'
import { type GetHeadersOptions } from '@platformatic/client'

declare namespace database {
  export type Database = {
    getUrls(req?: GetUrlsRequest): Promise<GetUrlsResponses>;
    createUrl(req?: CreateUrlRequest): Promise<CreateUrlResponses>;
    updateUrls(req?: UpdateUrlsRequest): Promise<UpdateUrlsResponses>;
    getUrlById(req?: GetUrlByIdRequest): Promise<GetUrlByIdResponses>;
    updateUrl(req?: UpdateUrlRequest): Promise<UpdateUrlResponses>;
    deleteUrls(req?: DeleteUrlsRequest): Promise<DeleteUrlsResponses>;
    trackUrl(req?: TrackUrlRequest): Promise<TrackUrlResponses>;
  }
  export interface DatabaseOptions {
    url: string
  }
  export const database: DatabasePlugin;
  export { database as default };
  export interface FullResponse<T, U extends number> {
    'statusCode': U;
    'headers': Record<string, string>;
    'body': T;
  }

  export type GetUrlsRequest = {
    'limit'?: number;
    'offset'?: number;
    'totalCount'?: boolean;
    'fields'?: Array<'count' | 'id' | 'url'>;
    'where.count.eq'?: number;
    'where.count.neq'?: number;
    'where.count.gt'?: number;
    'where.count.gte'?: number;
    'where.count.lt'?: number;
    'where.count.lte'?: number;
    'where.count.like'?: number;
    'where.count.in'?: string;
    'where.count.nin'?: string;
    'where.count.contains'?: string;
    'where.count.contained'?: string;
    'where.count.overlaps'?: string;
    'where.id.eq'?: string;
    'where.id.neq'?: string;
    'where.id.gt'?: string;
    'where.id.gte'?: string;
    'where.id.lt'?: string;
    'where.id.lte'?: string;
    'where.id.like'?: string;
    'where.id.in'?: string;
    'where.id.nin'?: string;
    'where.id.contains'?: string;
    'where.id.contained'?: string;
    'where.id.overlaps'?: string;
    'where.url.eq'?: string;
    'where.url.neq'?: string;
    'where.url.gt'?: string;
    'where.url.gte'?: string;
    'where.url.lt'?: string;
    'where.url.lte'?: string;
    'where.url.like'?: string;
    'where.url.in'?: string;
    'where.url.nin'?: string;
    'where.url.contains'?: string;
    'where.url.contained'?: string;
    'where.url.overlaps'?: string;
    'where.or'?: Array<string>;
    'orderby.count'?: 'asc' | 'desc';
    'orderby.id'?: 'asc' | 'desc';
    'orderby.url'?: 'asc' | 'desc';
  }

  export type GetUrlsResponseOK = Array<{ 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }>
  export type GetUrlsResponses =
    GetUrlsResponseOK

  export type CreateUrlRequest = {
    'id'?: string;
    'url': string;
    'count'?: number | null;
  }

  export type CreateUrlResponseOK = { 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }
  export type CreateUrlResponses =
    CreateUrlResponseOK

  export type UpdateUrlsRequest = {
    'fields'?: Array<'count' | 'id' | 'url'>;
    'where.count.eq'?: number;
    'where.count.neq'?: number;
    'where.count.gt'?: number;
    'where.count.gte'?: number;
    'where.count.lt'?: number;
    'where.count.lte'?: number;
    'where.count.like'?: number;
    'where.count.in'?: string;
    'where.count.nin'?: string;
    'where.count.contains'?: string;
    'where.count.contained'?: string;
    'where.count.overlaps'?: string;
    'where.id.eq'?: string;
    'where.id.neq'?: string;
    'where.id.gt'?: string;
    'where.id.gte'?: string;
    'where.id.lt'?: string;
    'where.id.lte'?: string;
    'where.id.like'?: string;
    'where.id.in'?: string;
    'where.id.nin'?: string;
    'where.id.contains'?: string;
    'where.id.contained'?: string;
    'where.id.overlaps'?: string;
    'where.url.eq'?: string;
    'where.url.neq'?: string;
    'where.url.gt'?: string;
    'where.url.gte'?: string;
    'where.url.lt'?: string;
    'where.url.lte'?: string;
    'where.url.like'?: string;
    'where.url.in'?: string;
    'where.url.nin'?: string;
    'where.url.contains'?: string;
    'where.url.contained'?: string;
    'where.url.overlaps'?: string;
    'where.or'?: Array<string>;
    'id'?: string;
    'url': string;
    'count'?: number | null;
  }

  export type UpdateUrlsResponseOK = Array<{ 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }>
  export type UpdateUrlsResponses =
    UpdateUrlsResponseOK

  export type GetUrlByIdRequest = {
    'fields'?: Array<'count' | 'id' | 'url'>;
    'id': string;
  }

  export type GetUrlByIdResponseOK = { 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }
  export type GetUrlByIdResponses =
    GetUrlByIdResponseOK

  export type UpdateUrlRequest = {
    'fields'?: Array<'count' | 'id' | 'url'>;
    'id': string;
    'url': string;
    'count'?: number | null;
  }

  export type UpdateUrlResponseOK = { 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }
  export type UpdateUrlResponses =
    UpdateUrlResponseOK

  export type DeleteUrlsRequest = {
    'fields'?: Array<'count' | 'id' | 'url'>;
    'id': string;
  }

  export type DeleteUrlsResponseOK = { 'id'?: string | null; 'url'?: string | null; 'count'?: number | null }
  export type DeleteUrlsResponses =
    DeleteUrlsResponseOK

  export type TrackUrlRequest = {
    'id': string;
  }

  export type TrackUrlResponseOK = unknown
  export type TrackUrlResponses =
    FullResponse<TrackUrlResponseOK, 200>

}

type DatabasePlugin = FastifyPluginAsync<NonNullable<database.DatabaseOptions>>

declare module 'fastify' {
  interface ConfigureDatabase {
    getHeaders(req: FastifyRequest, reply: FastifyReply, options: GetHeadersOptions): Promise<Record<string,string>>;
  }
  interface FastifyInstance {
    configureDatabase(opts: ConfigureDatabase): unknown
  }

  interface FastifyRequest {
    'database': database.Database;
  }
}

declare function database(...params: Parameters<DatabasePlugin>): ReturnType<DatabasePlugin>;
export = database;
