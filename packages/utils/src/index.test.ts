describe('utils', () => {
  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })
})
