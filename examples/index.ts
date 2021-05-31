import path from 'path';
import { Request, Response } from 'express';

import { coApp } from '../src';

const app = coApp.createApp({
  base: path.resolve(__dirname),
  serverInfo: {
    id: 'app1',
    type: 'api',
    port: 4001,
    host: 'http://127.0.0.1'
  }
});

const timeFilter = (req: Request, res: Response, next) => {
  const start = new Date().getTime();
  const calc = () => {
    console.log(`耗时${Date.now() - start}ms`);
  };

  res.once('finish', calc);
  next();
};

app.set('httpConfig', {
  filters: [timeFilter]
});

app.set('serverConfig', {
  cronConfigs: {
    api: [{
      id: 'a', time: '*/10 * * * * *', action: 'api.add'
    }]
  }
});

app.start().then();
