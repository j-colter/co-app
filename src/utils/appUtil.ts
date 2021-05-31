
import co from '../co';
import { IComponent } from '..';
import { Application } from '../application';

export const loadDefaultComponents = (app: Application) => {
  app.load(co.components.http, app.get('httpConfig'));
  app.load(co.components.server, app.get('serverConfig'));
};

export const optComponents = async (loaded: IComponent[], method: string) => {
  for (const load of loaded) {
    if (load[method]) {
      await load[method]();
    }
  }
};
