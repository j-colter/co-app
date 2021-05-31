
import { STATE } from '../utils/constants';
import { Server } from '../server/server';
import { IComponent, IServerOptions } from '..';

const { INIT, STARTED, STOPPED } = STATE;

export class ServerComponent implements IComponent {
  public name = '__server__';
  public state: STATE;
  public server: Server;

  constructor(app, opts: IServerOptions) {
    this.state = INIT;
    this.server = new Server(app, opts);
  }

  public async start() {
    if (this.state > INIT) return;

    this.state = STARTED;
    this.server.start();
  }
  public async afterStart() {
    this.server.afterStart();
  }
  public async stop() {
    this.state = STOPPED;
    this.server.stop();
  }
}

