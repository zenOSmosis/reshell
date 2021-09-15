import fs from 'fs';

/**
 * Asynchronous file open.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_open_path_flags_mode_callback
 * @see http://man7.org/linux/man-pages/man2/open.2.html
 * 
 * @param {string} path
 * @param {string} flags?
 * @param {number} mode
 * @return {Promise<number>} Resolves a numerical file descriptor for other
 * file operations.
 * @throws {Promise<Error>}
 */
const open = (path, flags = null, mode = null) => {
  return new Promise((resolve, reject) => {
    fs.open(path, flags, mode, (error, fd) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(fd);
      }
    });
  });
};

export default open;