describe('player', () => {
  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })
})
