import { NEWLINE, FOLDER_ID } from "./constants"

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
    const ss = SpreadsheetApp.getActiveSpreadsheet()
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

/**
 * Convert a google sheet to TSV file content.
 *
 * @returns string
 */
export const convertRangeToTsvFile = (sheet: GoogleAppsScript.Spreadsheet.Sheet): string => {
    // get available data range in the spreadsheet
    const activeRange = sheet.getDataRange()
    try {
        const data = activeRange.getValues()
        const formulas = activeRange.getFormulas()
        let tsvFile = ""

        if (!(data.length > 1)) {
            return tsvFile
        }

        // loop through the data in the range and build a string with the tsv  data
        let tsv = ""
        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                let cell = data[row][col]

                const formula = formulas[row][col]
                if (formula !== "") {
                    cell = formula
                }
                // if (cell.toString().indexOf("\t") != -1) {
                // }

                cell = cell.replaceAll(/"/g, "\"")
                cell = cell.replaceAll(/\s*(\n)|(\r\n)\s*/g, " ")
                cell = `\"${cell}\"`
                data[row][col] = cell
            }

            // join each row's columns
            // add a carriage return to end of each row, except for the last one
            tsv += data[row].join("\t") + NEWLINE
            // if (row < data.length - 1) {
            //     tsv += data[row].join("\t") + NEWLINE
            // } else {
            //     tsv += data[row].join("\t")
            // }
        }
        tsvFile = tsv
        return tsvFile
    } catch(err) {
        Logger.log(err)
        Browser.msgBox(err as string)
        return ""
    }
}
