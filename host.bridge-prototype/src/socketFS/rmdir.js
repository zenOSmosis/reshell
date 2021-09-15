import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * Removes a directory.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_rmdir_path_callback
 * 
 * @param {string} path
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const rmdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, (error) => {
      if (error) {
        console.error(error);
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

export default rmdir;