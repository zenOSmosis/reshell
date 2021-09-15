import fs from 'fs';

/**
 * Writes data to the file, replacing the file if it already exists. data can
 * be a string or a buffer.
 * 
 * Note, thie eoncoding option is ignored if data is a buffer.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * 
 * @param {string} file Filename or file descriptor.
 * @param {string | Buffer | TypedArray | DataView} data
 * @param {Object} options?
 * @return {Promise<void>}
 * @throws {Promise<Error>}
 */
const writeFile = (file, data, options = {}) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, options, (error) => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
};

export default writeFile;