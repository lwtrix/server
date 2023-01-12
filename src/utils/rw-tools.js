import { fileURLToPath } from 'url'
import { dirname, join } from "path";
import fs from 'fs-extra'

const { readJSON, writeJSON, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')

export const plannersJSONPath = join(dataFolderPath, 'planners.json')
export const tasksJSONPath = join(dataFolderPath, 'tasks.json')

export const getPlanners = () => readJSON(plannersJSONPath)
export const getTasks = () => readJSON(tasksJSONPath)

export const writePlanners = (plannersArr) => writeJSON(plannersJSONPath, plannersArr)
export const writeTasks = (tasksArr) => writeJSON(tasksJSONPath, tasksArr)