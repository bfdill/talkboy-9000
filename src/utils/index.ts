/**
 * https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript/7228322#7228322
 * @param min lower bound number
 * @param max upper bound number
 */
export const randomIntFromInterval = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)
