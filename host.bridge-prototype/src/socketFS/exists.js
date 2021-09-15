import fs from 'fs';

/**
 * Test whether or not the given path exists by checking with the file system. 
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_exists_path_callback
 * 
 * @param {string} path
 * @return {Promise<boolean>} Whether or not the path exists.
 */
const exists = (path) => {
  // Note, this method has no error handling, per Node.js
  return new Promise((resolve/*, reject */) => {
    fs.exists(path, (exists) => {
      return resolve(exists);
    });
  });
};

export default exists;