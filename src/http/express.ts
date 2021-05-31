import path from 'path';
import express, { Request, Response } from 'express';
import http from 'http';

import { Server } from 'typescript-rest';
import { IHttpServer, TFilter } from '..';
import { Application } from '../application';
import { getRoutePath, readDir } from '../utils/pathUtil';

export class ExpressServer implements IHttpServer {
  public port: number;
  public filters: TFilter[] = [];
  public express: express.Express;
  public expressServer: http.Server;

  constructor(public app: Application) {
    this.port = app.getCurServer().port;
    this.express = express();
  }

  public addFilter(filter: TFilter) {
    this.filters.push(filter);
  }

  public async start() {
    this.filters.map((elem: any) => {
      if (!Array.isArray(elem)) elem = [elem];
      this.express.use(...elem);
    });

    this.loadRoutes();

    this.expressServer = this.express.listen(this.port, () => this.app.logger.info(`http start at ${this.port}`));
  }

  public async afterStart() {
    this.app.logger.info('Http afterStart');
    Server.buildServices(this.express);
  }

  public async stop() {
    await new Promise((resolve) => {
      this.expressServer.close(() => {
        this.app.logger.info('Http stop');
        resolve(null);
      })
    })
  }

  public addRoute(...args: any) {
    this.express.use(...args);
  }

  /**
   * 加载路由
   */
  public loadRoutes() {
    this.express.get('/', (req: Request, res: Response) => {
      res.send('http-server ok!');
    });
    const routesPath = getRoutePath(this.app.getBase(), this.app.getServerType());

    readDir(routesPath, file => {
      const fileInfo = path.parse(file);
      if (fileInfo.name === 'index') return;

      require(file).default;
    });
  }
}
