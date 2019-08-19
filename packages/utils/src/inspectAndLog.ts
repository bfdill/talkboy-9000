import { inspect } from 'util'

export const inspectAndLog = (entries: { [name: string]: Object }): void => {
  Object.entries(entries).forEach(entry => {
    const [name, obj] = entry

    console.log(`${name}(${inspect(obj, true, 10)})`)
  })
}
