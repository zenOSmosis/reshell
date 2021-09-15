import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_stat_path_options_callback
 * 
 * @param {string} path 
 * @param {Object} options?
 * @return {Promise<FSStats>}
 * @throws {Promise<Error>}
 */
const stat = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, options, (error, stats) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(stats);
      }
    });
  });
};

export default stat;