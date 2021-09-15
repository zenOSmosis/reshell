import fs from 'fs';

/**
 * Tests a user's permissions for the file or directory specified by path.
 * 
 * @param {string} path 
 * @param {number} mode? Default fs.constants.F_OK
 * @return {Promise<void>}
 * @throws {Promise<Error>} 
 */
const access = (path, mode = null) => {
  try {
    return new Promise((resolve, reject) => {
      fs.access(path, mode, (error) => {
        if (error) {
          return reject(error);
        } else {
          return resolve();
        }
      });
    });
  } catch (exc) {
    throw exc;
  }
};

export default access;