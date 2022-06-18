import { FOLDER_ID } from "./util"
// import { convertRangeToJson } from "./convertRangeToJson"
import { Parser } from "./Parser"

/**
 * Save the current Sheet as a JSON file.
 */
export const saveAsJson = (): void => {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const newFolderName = ss.getName().toLowerCase().replace(/   /g,"_") + "_json_" + new Date().getTime()
    const parentFolder = DriveApp.getFolderById(FOLDER_ID)
    // create a folder from the name of the spreadsheet
    const folder = parentFolder.createFolder(newFolderName)

    const sheet = ss.getActiveSheet()
    const fileName = `${sheet.getName()}.json`
    const content = new Parser(sheet).process()
    folder.createFile(fileName, content)

    Browser.msgBox(`Files are waiting in a folder named ${parentFolder}/${newFolderName}`)
}
