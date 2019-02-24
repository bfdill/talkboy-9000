import { playFile, dohFilename } from '.'

describe('modules -> player', () => {
  test('play', () => {
    playFile(dohFilename)
  })
  test('log path fail', () => {
    playFile('../../../../../not.mp3')
  })
})
