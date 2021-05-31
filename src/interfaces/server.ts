
export interface ICron {
  id: string;                       // 唯一id
  time: string;                     // linux cron tab
  action: string;                   // 操作xxCron.task
  serverId?: string;                // 指定某台服务器运行
}

export interface ICronConfigs {
  [serverType: string]: ICron[];
}

export interface IServerOptions {
  cronConfigs?: ICronConfigs;
}
