import { NEWLINE } from "./constants"

/**
 * Convert a google sheet to TSV file content.
 *
 * @author Michael Derazon
 * @author xFanatical
 * @author Clay Dunston
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
