import _ from 'lodash';
import fs from 'fs';
import { load } from 'sdg-loader';
import schedule from 'node-schedule';

import { STATE } from '../utils/constants';
import { Application } from '../application';
import { getCronPath } from '../utils/pathUtil';
import { ICron, ICronConfigs, IServerOptions } from '..';

const { INIT, STARTED, STOPPED } = STATE;

export class Server {
  public state: STATE;
  public cronHandlers: { [handler: string]: { [method: string]: () => void } } = {};
  public crons: ICron[] = [];
  public cronConfigs: ICronConfigs = {};
  public jobs: { [cronId: string]: schedule.Job } = {};

  constructor (public app: Application, opts: IServerOptions) {
    this.state = INIT;

    this.cronConfigs = opts.cronConfigs || {};
  }

  public start() {
    if(this.state > INIT) return;

    this.initCrons(true, true);
    this.state = STARTED;
  }

  public afterStart() {}

  public stop() {
    this.state = STOPPED;
  }

  /**
   * 初始化crons
   * @param manualReload 是否替换
   * @param clear 是否清空
   */
  public initCrons(manualReload = false, clear = false) {
    if (manualReload) {
      console.info('loadCrons remove crons', this.crons);

      this.removeCrons(this.crons.map(c => c.id));
      if (clear) {
        this.crons = [];
      }
    }
    this.cronHandlers = this.loadCronHandlers(manualReload);
    this.loadCrons(manualReload);
    if (manualReload) {
      this.createSchedule();
    }
  }

  /**
   * 加载定时器handler
   * @param manualReload
   */
  private loadCronHandlers(manualReload = false) {
    const app = this.app;
    let all: { [key: string]: any } = {};
    let p = getCronPath(app.getBase(), app.getServerType());

    if (p && fs.existsSync(p)) {
      const cron = load(p, app, manualReload);
      for (let name in cron) {
        all[name] = cron[name];
      }
    }

    return all;
  }

  /**
   * 根据配置加载定时器
   * @param manualReload 是否替换旧的
   */
  private loadCrons(manualReload = false) {
    const cronConfigs = this.cronConfigs;
    if (!cronConfigs) return;

    const app = this.app;
    for (let serverType in cronConfigs) {
      if (app.serverType === serverType) {
        for (const c of cronConfigs[serverType]) {
          if (!c.serverId) {
            this.checkAndAdd(c, manualReload);
          } else if (c.serverId === app.serverId) {
            this.checkAndAdd(c, manualReload);
          }
        }
      }
    }
  }

  /**
   * 检查并添加cron
   * @param cron
   * @param replace
   */
  private checkAndAdd(cron: ICron, replace = false) {
    const oldCron = _.find(this.crons, { id: cron.id });
    if (oldCron) {
      if (replace) {
        console.warn('cron is duplicated: %j', cron);
        oldCron.time = cron.time;
        oldCron.action = cron.action;
      }
    } else {
      this.crons.push(cron);
    }
  }

  /**
   * 生成schedule
   */
  private createSchedule() {
    for (const cron of this.crons) {
      const { id, action, time } = cron;
      const [name, method] = action.split('.');
      const handler = this.cronHandlers[name];

      if (!handler) {
        console.error('could not find handler: %j', cron);
        continue;
      }

      if (typeof handler[method] !== 'function') {
        console.error('could not find cron job: %j, %s', cron, method);
        continue;
      }

      this.jobs[id] = schedule.scheduleJob(time, handler[method].bind(handler));
    }
  }

  /**
   * 移除现有的cron
   * @param ids
   */
  private removeCrons(ids: string | string[]) {
    if (!_.isArray(ids)) ids = [ids];

    for (const id of ids) {
      if (this.jobs[id]) {
        schedule.cancelJob(this.jobs[id]);
        delete this.jobs[id];
      } else {
        console.warn('cron is not in application: %s', id);
      }
    }
  }
};

