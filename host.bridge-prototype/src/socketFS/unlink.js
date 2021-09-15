import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * Removes a file or symbolic link.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_unlink_path_callback
 *
 * @param {string} path 
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const unlink = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (error) => {
      if (error) {
        console.error(error);
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

export default unlink;