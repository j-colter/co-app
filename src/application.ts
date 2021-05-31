import _ from 'lodash';

import { EKeyWords, RESERVED } from './utils/constants';
import { loadDefaultComponents, optComponents } from './utils/appUtil';
import { IHttpOptions } from './interfaces/http';
import { IServerOptions } from './interfaces/server';
import { IObject, TObjectType } from './interfaces/common';
import { IComponent, IComponents } from './interfaces/component';
import { IApplicationOptions, IServerInfo } from './interfaces/application';

export class Application {
  public logger: Console;
  public serverInfo: IServerInfo;
  public loaded: IComponent[] = [];
  // @ts-ignore
  public components: IComponents = {};
  public serverMap: { [key: string]: IServerInfo } = {};
  public settings: IObject = {};

  private startTime = 0;

  constructor(opts: IApplicationOptions) {
    const base = opts.base || process.cwd();
    this.logger = opts.logger || console;
    this.serverInfo = opts.serverInfo;
    this.set(EKeyWords.BASE, base);
  }

  public async start() {
    this.startTime = Date.now();

    loadDefaultComponents(this);
    await optComponents(this.loaded, RESERVED.START);

    await this.afterStart();
  }
  private async afterStart() {
    await optComponents(this.loaded, RESERVED.AFTER_START);
    this.logger.info(`[${this.serverId}] startup in ${Date.now() - this.startTime} ms`);
  }

  public get(key: 'httpConfig'): IHttpOptions;
  public get(key: 'serverConfig'): IServerOptions;
  public get(key: string): any;
  public get(key: string) {
    return this.settings[key];
  }

  public set(key: 'httpConfig', value: IHttpOptions, attach?: boolean);
  public set(key: 'serverConfig', value: IServerOptions, attach?: boolean);
  public set(key: string, value: any, attach?: boolean);
  public set(key: string, value: any, attach = false) {
    this.settings[key] = value;
    if (attach) this[key] = value;
  }

  /**
   * 加载组件
   * @param component
   * @param opts
   */
  public load<T extends IComponent>(component: T, opts?: any): T
  public load<T extends IComponent>(component: TObjectType<T>, opts?: any): T
  public load<T extends IComponent>(component: TObjectType<T> | T, opts?: any): T {
    const name = component.name;

    if (typeof component === 'function') {
      component = new component(this, opts || {});
    }

    if (name && this.components[name as string]) {
      // ignore duplicate component
      this.logger.warn('ignore duplicate component: %j', name);
      return component;
    }

    this.loaded.push(component);
    this.components[name] = component;

    return component;
  }

  public getBase() {
    return this.get(EKeyWords.BASE) as string;
  }
  public getCurServer() {
    return this.serverInfo;
  }
  public getServerType(serverInfo?: IServerInfo) {
    return serverInfo ? serverInfo.type : this.serverInfo.type;
  }
  public getServersByType(type: string) {
    return _.values(this.serverMap).filter(s => s.type === type);
  }

  public get serverId() {
    return this.getCurServer().id;
  }
  public get serverType() {
    return this.getCurServer().type;
  }
}
