import * as fs from 'fs'
import { join } from 'path'
import * as archiver from 'archiver'

const addFile = (archive: archiver.Archiver, filename: string) =>
  archive.append(fs.createReadStream(join(process.cwd(), filename)), { name: filename })
const output = fs.createWriteStream(join(process.cwd(), 'app.zip'))
const appZip = archiver('zip', {
  zlib: { level: 9 }
})

appZip.pipe(output)
addFile(appZip, 'package.json')
appZip.directory(join(process.cwd(), 'audio/'), 'audio')
appZip.directory(join(process.cwd(), 'node_modules/'), 'node_modules')
appZip.directory(join(process.cwd(), 'dist/'), 'dist')
appZip.finalize()
