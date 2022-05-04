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
    const sheets = ss.getSheets()
    // create a folder from the name of the spreadsheet
    const folder = DriveApp.createFolder(ss.getName().toLowerCase().replace(/   /g,"_") + "_tsv_" + new Date().getTime())
    for (const sheet of sheets) {
        // append ".tsv" extension to the sheet name
        const fileName = sheet.getName() + ".tsv"
        // convert all available sheet data to tsv format
        const tsvFile = convertRangeTotsvFile(sheet)
        // create a file in the Docs List with the given name and the tsv data
        folder.createFile(fileName, tsvFile)
    }
    Browser.msgBox("Files are waiting in a folder named " + folder.getName())
}

/**
 * Convert a google sheet to TSV file content.
 *
 * @returns string
 */
export const convertRangeTotsvFile = (sheet: GoogleAppsScript.Spreadsheet.Sheet): string => {
    // get available data range in the spreadsheet
    const activeRange = sheet.getDataRange()
    try {
        const data = activeRange.getValues()
        const formula = activeRange.getFormulas()
        let tsvFile = ""

        // loop through the data in the range and build a string with the tsv  data
        if (data.length > 1) {
            let tsv = ""
            for (let row = 0; row < data.length; row++) {
                for (let col = 0; col < data[row].length; col++) {
                    if (formula[row][col] !== "") {
                        data[row][col] = formula[row][col]
                    }
                    if (data[row][col].toString().indexOf("\t") != -1) {
                        data[row][col] = "\"" + data[row][col] + "\""
                    }
                }

                // join each row's columns
                // add a carriage return to end of each row, except for the last one
                if (row < data.length-1) {
                    tsv += data[row].join("\t") + "\r\n"
                }
                else {
                    tsv += data[row].join("\t")
                }
            }
            tsvFile = tsv
        }
        return tsvFile
    }
    catch(err) {
        Logger.log(err)
        Browser.msgBox(err as string)
        return ""
    }
}
