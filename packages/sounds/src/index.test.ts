describe('sounds', () => {
  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })
})
