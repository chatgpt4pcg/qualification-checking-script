import {appendLog, createLogFolder, listAllFiles, parseSourceFolderArgument} from 'chatgpt4pcg-node'
import { containDisallowedCharacters, containObjectTokens, countWords } from 'chatgpt4pcg';

import fs from 'fs'
import path from 'path'

const CURRENT_STAGE = 'qualified'
const MAX_WORDS = 900

async function main() {
  let sourceFolder = ''

  try {
    sourceFolder = parseSourceFolderArgument()
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message)
    }
    return
  }
  
  const outputDir = path.posix.join(sourceFolder, '..', CURRENT_STAGE)
  if (!fs.existsSync(outputDir)) {
    await fs.promises.mkdir(outputDir)
  }

  const logFolderPath = await createLogFolder(outputDir)

  const promptsFiles = await listAllFiles(sourceFolder)

  promptsFiles.forEach(async (promptFile) => {
    const promptFilePath = path.posix.join(sourceFolder, promptFile)
    const fileContent = await fs.promises.readFile(promptFilePath, 'utf-8')

    const hasExceedMaxLength = countWords(fileContent) > MAX_WORDS
    const exceedLengthLog = `[${new Date().toISOString()}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - maxLength: ${hasExceedMaxLength ? 'Failed' : 'Succeed'}`
    await appendLog(logFolderPath, CURRENT_STAGE, exceedLengthLog)

    if (hasExceedMaxLength) {
      return
    }

    const hasContainDisallowChars = containDisallowedCharacters(fileContent)
    const disallowCharLog = `[${new Date().toISOString()}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - disallowChars: ${hasContainDisallowChars ? 'Failed' : 'Succeed'}`
    await appendLog(logFolderPath, CURRENT_STAGE, disallowCharLog)

    if (hasContainDisallowChars) {
      return
    }


    const hasNoObjectToken = !containObjectTokens(fileContent)
    const objectTokenLog = `[${new Date().toISOString()}] Processing - team: ${promptFile.split('.').slice(0, -1).join('.')} - objectToken: ${hasNoObjectToken ? 'Failed' : 'Succeed'}`
    await appendLog(logFolderPath, CURRENT_STAGE, objectTokenLog)

    if (hasNoObjectToken) {
      return
    }

    await fs.promises.copyFile(promptFilePath, path.posix.join(outputDir, promptFile))
  })
}

main()