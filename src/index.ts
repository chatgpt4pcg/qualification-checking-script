import { appendLog, createLogFolder, listAllFiles } from './file-utils';
import { containDisallowedCharacters, containObjectTokens, countWords } from 'chatgpt4pcg';

import fs from 'fs'
import parseArgs from 'minimist'
import path from 'path'

const MAX_WORDS = 900

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const argv = process.platform === 'win32' ? args['_'] : args['s']
  if (argv === undefined) {
    throw Error('Insufficient parameters to work with.')
  }

  const sourceFolder = argv + '/'
  const sFolder = path.posix.resolve(sourceFolder)
  
  const outputDir = path.posix.join(sFolder, '..', 'qualified')
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir)
  }

  const logFolderPath = await createLogFolder(outputDir)

  const promptsFiles = await listAllFiles(sFolder)
  for (const promptFile of promptsFiles) {
    const promptFilePath = path.posix.join(sFolder, promptFile)
    const fileContent = await fs.promises.readFile(promptFilePath, 'utf-8')

    const hasExceedMaxLength = countWords(fileContent) > MAX_WORDS
    const exceedLengthLog = `[${new Date().toISOString().replaceAll(':', '_')}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - maxLength: ${hasExceedMaxLength ? 'Failed' : 'Success'}`
    await appendLog(logFolderPath, exceedLengthLog)

    if (hasExceedMaxLength) {
      continue
    }

    const hasContainDisallowChars = containDisallowedCharacters(fileContent)
    const disallowCharLog = `[${new Date().toISOString().replaceAll(':', '_')}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - disallowChars: ${hasContainDisallowChars ? 'Failed' : 'Success'}`
    await appendLog(logFolderPath, disallowCharLog)

    if (hasContainDisallowChars) {
      continue
    }


    const hasNoObjectToken = !containObjectTokens(fileContent)
    const objectTokenLog = `[${new Date().toISOString().replaceAll(':', '_')}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - objectToken: ${hasNoObjectToken ? 'Failed' : 'Success'}`
    await appendLog(logFolderPath, objectTokenLog)

    if (hasNoObjectToken) {
      continue
    }

    await fs.promises.copyFile(promptFilePath, path.posix.join(outputDir, promptFile))
  }
}
main()