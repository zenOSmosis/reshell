import fs from 'fs';

/**
 * Asynchronous close.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_close_fd_callback
 * @see http://man7.org/linux/man-pages/man2/close.2.html
 * 
 * @param {number} fd
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const close = (fd) => {
  return new Promise((resolve, reject) => {
    fs.close(fd, (error) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(fd);
      }
    });
  });
};

export default close;