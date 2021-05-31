
// 服务器配置
export interface IServerInfo {
  id: string;
  host: string;
  port: number;
  type: string;
}

export interface IApplicationOptions {
  base?: string;              // 项目根目录
  logger?: Console;
  serverInfo: IServerInfo;
}
