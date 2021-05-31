import { HttpComponent } from '../components/http';
import { ServerComponent } from '../components/server';

export interface IComponent {
  name: string;
  beforeStart?: () => Promise<void>;
  start?: () => Promise<void>;
  afterStart?: () => Promise<void>;
  afterStartAll?: () => Promise<void>;
  stop?: (force: boolean) => Promise<void>;
}

export interface IComponents {
  __http__: HttpComponent;
  __server__: ServerComponent;
}
