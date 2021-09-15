import fs from 'fs';

// TODO: Set max upper limit for read size

/**
 * Reads the contents of a file.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
 * 
 * @param {string} path
 * @param {Object} options?
 * @return {Promise<string | Buffer>}
 */
const readFile = (path, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (error, data) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });
};

export default readFile;