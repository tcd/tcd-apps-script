// https://developers.google.com/apps-script/reference/spreadsheet/range

const isEven = (n: number) => (n == 0) || (n % 2 == 0)
const isOdd  = (n: number) => (n % 2 == 1)

export const cleanCell = (cell: string): string => {
    const cleaned = cell
        .replaceAll(/"/g, "\"")
        .replaceAll(/\s*(\n)|(\r\n)\s*/g, " ")
    return `\"${cleaned}\"`
}

interface ConvertRowsToObjectOptions {
    row_1: any[]
    row_2: any[]
    row_1_index: number
    formulas: string[][]
}

const convertRowsToObject = (row_1: any[], row_2: any[]): any => {
    const result: any = {}
    for (let i = 0; i < row_1.length; i++) {
        const key = row_1[i]
        const value = row_2[i]
    }
}

/**
 * Very specific use case.
 */
export const convertRangeToJson = (sheet: GoogleAppsScript.Spreadsheet.Sheet): string => {
    // get available data range in the spreadsheet
    const range: GoogleAppsScript.Spreadsheet.Range = sheet.getDataRange()
    const result: any = {}
    try {
        const formulas = range.getFormulas()
        const data = range.getValues()

        if (!(data.length > 1)) {
            Browser.msgBox("No data found")
            return ""
        }

        if (isOdd(data.length)) {
            Browser.msgBox("Unable to convert a sheet with an odd number of rows")
            return ""
        }
        const groupCount = data.length / 2
        const lastColumn = range.getLastColumn()

        const groups = []

        // for (const row in data) {
        //     for (const col in data[row]) {
        //         const cell = data[row][col]
        //     }
        // }

        for (let i = 0; i < data.length; i++) {

        }

        // // loop through the data in the range and add data to result
        // for (let row = 0; row < data.length; row++) {
        //     for (let col = 0; col < data[row].length; col++) {
        //         let cell = data[row][col]

        //         const formula = formulas[row][col]
        //         if (formula !== "") {
        //             cell = formula
        //         }
        //         data[row][col] = cleanCell(cell)
        //     }
        // }
        return JSON.stringify(result)
    } catch(err) {
        Logger.log(err)
        Browser.msgBox(err as string)
        return result
    }
}
