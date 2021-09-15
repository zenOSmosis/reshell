import fs from 'fs';

/**
 * Write buffer to the file specified by fd.
 * 
 * @see https://nodejs.org/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback
 * 
 * @param {number} fd
 * @param {Buffer | TypedArray | DataView} buffer The buffer that the data will
 * be written from.
 * @param {number} offset Determines the part of the buffer to be written.
 * @param {number} length An integer specifying the number of bytes to write.
 * @param {number} position? Specifies where to begin reading from in the file.
 * If position is null, data will be written from the current file position, and
 * the file position will be updated. If position is an integer, the file
 * position will remain unchanged.
 * @return {Promise<[bytesWritten: number, buffer: Buffer | TypedArray | DataView]>}
 * @throws {Promise<Error>}
 */
const write = (fd, buffer, offset, length, position = null) => {
  return new Promise((resolve, reject) => {
    fs.write(fd, buffer, offset, length, position, (error, bytesRead, buffer) => {
      if (error) {
        return reject(error);
      } else {
        return resolve([bytesRead, buffer]);
      }
    });
  });
};

export default write;