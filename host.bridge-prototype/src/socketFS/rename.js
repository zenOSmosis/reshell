import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * @see https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback
 * 
 * @param {string} oldPath 
 * @param {string} newPath
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const rename = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (error) => {
      if (error) {
        console.error(error);
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

export default rename;