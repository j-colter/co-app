
import { Application } from './application';
import { HttpComponent } from './components/http';
import { ServerComponent } from './components/server';
import { IApplicationOptions } from './interfaces/application';

export class Co {
  private _app: Application;
  public components = {
    http: HttpComponent,
    server: ServerComponent,
  };
  public filters = {
    // time: new TimeFilter(),
    // timeout: new TimeoutFilter()
  };

  public createApp(opts: IApplicationOptions) {
    const app = new Application(opts);
    this._app = app;
    return app;
  }

  /**
   * Get application
   */
  get app() {
    return this._app;
  }
}

export default new Co();
