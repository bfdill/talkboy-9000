import { koaApp } from './server'
import { KoaApp } from './app'

describe('server', () => {
  test('has known exports', () => {
    expect(Object.keys(require('./server'))).toMatchSnapshot()
  })

  test('koaApp is KoaApp', () => {
    expect(koaApp instanceof KoaApp).toBeTruthy()
  })
})
