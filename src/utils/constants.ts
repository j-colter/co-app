
// 路径配置
export enum EServerPath {
  SERVER = 'servers',
}

// 关键字
export enum EKeyWords {
  BASE = 'base',
}

// 保留关键字
export enum RESERVED {
  START = 'start',
  AFTER_START = 'afterStart',
}

// 服务器运行状态
export enum STATE {
  INIT = 0,
  STARTED = 1,
  STOPPED = 2,
  CLOSED = 3,
  DESTROYED = 4
}
