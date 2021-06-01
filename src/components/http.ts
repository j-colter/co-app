import { ServerContainer } from '@colter/typescript-rest';

import { Application } from '../application';
import { ExpressServer } from '../http/express';
import { IComponent, IHttpOptions, IHttpServer } from '..';

export class HttpComponent implements IComponent {
  public name = '__http__';
  public port: number;
  public httpServer: IHttpServer;

  constructor(public app: Application, opts: IHttpOptions) {
    this.port = this.app.getCurServer().port;
    this.httpServer = opts.httpServer || this.getDefaultServer();

    if (opts.encode) {
      ServerContainer.get().encode = opts.encode;
    }
    if (opts.decode) {
      ServerContainer.get().decode = opts.decode;
    }

    if (opts.filters) {
      opts.filters.map(b => this.httpServer.addFilter(b));
    }
  }

  public addRoute(...args: any) {
    this.httpServer.addRoute(...args);
  }

  public async start() {
    if (this.httpServer.start) {
      await this.httpServer.start();
    }
  }

  public async afterStart() {
    if (this.httpServer.afterStart) {
      await this.httpServer.afterStart();
    }
  }

  public async stop(force: boolean) {
    if (this.httpServer.stop) {
      await this.httpServer.stop(force);
    }
  }

  private getDefaultServer() {
    return new ExpressServer(this.app);
  }
}
