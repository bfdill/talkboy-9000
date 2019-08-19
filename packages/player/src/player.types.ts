import winston = require('winston')

export interface IPlayerService {
  playFile: (
    filename: string,
    parentLogger: winston.Logger
  ) => PromiseLike<void>
}
