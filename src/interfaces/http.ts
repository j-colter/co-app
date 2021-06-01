
export type TFilter = Function;

export interface IHttpOptions {
  filters?: TFilter[];
  httpServer?: IHttpServer;
  decode?: any;
  encode?: (data: any) => any;
}

export interface IHttpServer {
  start?: () => Promise<void>;
  afterStart?: () => Promise<void>;
  stop?: (force: boolean) => Promise<void>;
  loadRoutes: () => void;
  addFilter: (filter: TFilter) => void;
  addRoute: (...args: any) => void;
}
