const logDateFormat = 'YYYY-MM-DD HH:mm:ss';

const argv = process.argv;
const apps = [];

const init = (name, id = 0, instances = 1) => {
  const all = {};
  const defaults = {
    // args: [name, id],
    log_date_format: logDateFormat,
    min_uptime: '60s',
    max_restarts: 2,
    name: 'co-app',
    script: 'ts-node examples/index.ts',
  };

  if (name) {
    apps.push(defaults);
  } else {
    apps.push(...Object.keys(all).map(k => all[k]));
  }
};

init(argv[5], argv[6], argv[7]);

module.exports = {
  apps
};
