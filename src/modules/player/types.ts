import { ChildProcess } from 'child_process'

export type DefaultPlayer =
  | 'mplayer'
  | 'afplay'
  | 'mpg123'
  | 'mpg321'
  | 'play'
  | 'omxplayer'
  | 'aplay'
  | 'cmdmp3'
export type What = string | string[]
export type PlayerOptions = {
  player: any
  players?: DefaultPlayer | DefaultPlayer[] | string[]
}
export type PlayerArgs = { [playerName: string]: string[] }
export type PlayOptions = PlayerArgs & { stdio: 'ignore' }
export type Next = Function
export interface IPlayer {
  play: (what: What, options?: PlayOptions | Next, next?: Next) => ChildProcess
}
export type createPlayer = (opts?: PlayerOptions) => IPlayer
