import { playerService } from '.'

describe('modules -> player', () => {
  test('play', () => {
    playerService.playFile('/Users/bd50258/playground/bfd-soundboard/audio/doh.mp3')
  })
  test('log path fail', () => {
    playerService.playFile('../../../../../not.mp3')
  })
})
