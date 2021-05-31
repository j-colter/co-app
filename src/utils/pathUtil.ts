import fs from 'fs';
import path from 'path';

import { EServerPath } from './constants';

export const getRoutePath = (root: string, type: string) => {
  return path.resolve(root, EServerPath.SERVER, type, 'route');
};
export const getFilterPath = (root: string, type: string) => {
  return path.resolve(root, EServerPath.SERVER, type, 'filter');
};
export const getCronPath = (root: string, type: string) => {
  return path.resolve(root, EServerPath.SERVER, type, 'cron');
};

/**
 * 递归加载目录
 * @param dir
 * @param fn
 */
export const readDir = (dir: string, fn?: Function): string[] => {
  let arr: string[] = [];

  if (!fs.existsSync(dir)) {
    console.warn('no such file or directory', dir);
    return arr;
  }

  fs.readdirSync(dir).map(d => {
    const filename = path.resolve(dir, d);
    const stat = fs.statSync(filename);
    if (stat.isFile()) {
      fn && fn(filename);
      arr.push(filename);
    } else {
      arr = arr.concat(readDir(filename, fn));
    }
  });

  return arr;
};
