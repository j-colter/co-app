import { Application } from '../application';

export interface IObject {
  [key: string]: any;
}

export type TObjectType<T> = {
  new (app: Application, opts?: any): T;
}
