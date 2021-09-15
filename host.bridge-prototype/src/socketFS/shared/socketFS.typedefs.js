

/**
 * @typedef {string} FileFlag Can be any of 'r', 'r+', 'rs', 'rs+', 'w', 'wx',
 * 'w+', 'wx+', 'a', 'ax', 'a+', 'ax+'.
 * 
 * `'r'` - Open file for reading. An exception occurs if the file does not exist.
 * `'r+'` - Open file for reading and writing. An exception occurs if the file does not exist.
 * `'rs'` - Open file for reading in synchronous mode. Instructs the filesystem to not cache writes.
 * `'rs+'` - Open file for reading and writing, and opens the file in synchronous mode.
 * `'w'` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
 * `'wx'` - Like 'w' but opens the file in exclusive mode.
 * `'w+'` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
 * `'wx+'` - Like 'w+' but opens the file in exclusive mode.
 * `'a'` - Open file for appending. The file is created if it does not exist.
 * `'ax'` - Like 'a' but opens the file in exclusive mode.
 * `'a+'` - Open file for reading and appending. The file is created if it does not exist.
 * `'ax+'` - Like 'a+' but opens the file in exclusive mode.
 */

 /**
  * @see https://nodejs.org/api/fs.html#fs_class_fs_stats
  * 
  * @typedef {Object} FSStats
  * @property {number} dev e.g. 2114
  * @property {number} ino e.g. 48064969
  * @property {number} mode e.g. 33188
  * @property {number} nlink e.g. 1
  * @property {number} uid e.g. 85
  * @property {number} gid e.g. 100
  * @property {number} rdev e.g. 0
  * @property {number} size e.g. 527
  * @property {number} blksize e.g. 4096
  * @property {number} blocks e.g. 8
  * @property {number} atimeMs e.g. 1318289051000.1
  * @property {number} mtimeMs e.g. 1318289051000.1
  * @property {number} ctimeMs e.g. 1318289051000.1
  * @property {string} birthtimeMs e.g. 1318289051000.1
  * @property {string} atime e.g. "Mon, 10 Oct 2011 23:24:11 GMT"
  * @property {string} mtime e.g. "Mon, 10 Oct 2011 23:24:11 GMT"
  * @property {string} ctime e.g. "Mon, 10 Oct 2011 23:24:11 GMT"
  * @property {string} birthtime e.g. "Mon, 10 Oct 2011 23:24:11 GMT"
  */

/**
 * An object whose properties represent significant elements of a path.
 * 
 * Trailing directory separators are ignored.
 * 
 * @see https://nodejs.org/api/path.html#path_path_parse_path
 * 
 * @typedef {Object} PathParse
 * @property {string} Root
 * @property {string} dir
 * @property {string} base
 * @property {string} ext
 * @property {string} name
 */