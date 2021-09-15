import './shared/socketFS.typedefs';
import fs from 'fs';

/**
 * Creates an empty file.
 * 
 * @param {string} path 
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const touch = async (path) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, null, (error, fd) => {
      if (error) {
        // console.error(error);
        return reject(error);
      } else {
        return resolve(fd);
      }
    });
  });
};

export default touch;