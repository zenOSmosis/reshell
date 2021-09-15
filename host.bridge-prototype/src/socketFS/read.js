import fs from 'fs';

/**
 * Read buffer from the file specified by fd.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback
 * 
 * @param {number} fd
 * @param {Buffer | TypedArray | DataView} buffer The buffer that the data will
 * be read from.
 * @param {number} offset The offset in the buffer to start reading at.
 * @param {number} length An integer specifying the number of bytes to read.
 * @param {number} position? Specifies where to begin reading from in the file.
 * If position is null, data will be read from the current file position, and
 * the file position will be updated. If position is an integer, the file
 * position will remain unchanged.
 * @return {Promise<[bytesWritten: number, buffer: Buffer | TypedArray | DataView]>}
 * @throws {Promise<Error>}
 */
const read = (fd, buffer, offset, length, position = null) => {
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, offset, length, position, (error, bytesRead, buffer) => {
      if (error) {
        return reject(error);
      } else {
        return resolve([bytesRead, buffer]);
      }
    });
  });
};

export default read;