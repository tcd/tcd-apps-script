import { FOLDER_ID } from "./util"
import { convertRangeToTsvFile } from "./convertRangeToTsvFile"

/*
 * script to export data in all sheets in the current spreadsheet as individual tsv files
 * files will be named according to the name of the sheet
 * author: Michael Derazon
 * contributor: xFanatical
 * contributor: Clay Dunston
 */

/**
 * Create a new folder, output all sheets in current sheet to folder.
 */
export const saveAsTsv = (): void => {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
    const newFolderName = ss.getName().toLowerCase().replace(/   /g,"_") + "_tsv_" + new Date().getTime()
    const parentFolder = DriveApp.getFolderById(FOLDER_ID)
    // create a folder from the name of the spreadsheet
    const folder = parentFolder.createFolder(newFolderName)

    const sheets = ss.getSheets()
    for (const sheet of sheets) {
        const fileName = `${sheet.getName()}.tsv`    //append ".tsv" extension to the sheet name
        const tsvFile = convertRangeToTsvFile(sheet) // convert all available sheet data to tsv format
        folder.createFile(fileName, tsvFile)         // create a file in the Docs List with the given name and the tsv data
    }

    Browser.msgBox(`Files are waiting in a folder named ${parentFolder}/${newFolderName}`)
}
