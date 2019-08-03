import { randomIntFromInterval } from './randomIntFromInterval'
describe('randomIntFromInterval', () => {
  test('is random(ish)', () => {
    // this test is so bogus
    // i'm really just setting up lerna/yarn workspaces/typescript/jest
    // do not test a rng like this!
    const results = new Set([
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000),
      randomIntFromInterval(1, 1000)
    ])

    expect(results.size).toBeGreaterThan(5)
  })
})
