describe('winston-jest', () => {
  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })
})
