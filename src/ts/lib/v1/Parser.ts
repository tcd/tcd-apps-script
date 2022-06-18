import { isEven, columnToLetter } from ".."

// https://developers.google.com/apps-script/reference/spreadsheet/range
export class Parser {

    public sheet: GoogleAppsScript.Spreadsheet.Sheet
    public range: GoogleAppsScript.Spreadsheet.Range
    public data: any[][]
    public formulas: string[][]
    public result: any
    public resultMap: any

    private _rowCount: number
    // private _cellCount: number

    private _currentRowIndex: number
    // private _currentCellIndex: number

    private _failed: boolean
    private _errorMessage: string

    constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
        this._failed = false
        this._errorMessage = ""
        this._currentRowIndex  = 0
        // this._currentCellIndex = 0
        this.result = {}
        this.resultMap = {}

        this.sheet  = sheet

        this.range = this.sheet?.getDataRange()

        this.formulas = this.range?.getFormulas()
        this.data     = this.range?.getValues()

        this._rowCount = this.data.length
        // this._cellCount = this.data[0].length

        if (!(this._rowCount > 1)) {
            this._failed = true
            this._errorMessage = "No data found in current sheet"
            return
        }
    }

    public process(): string {
        if (this._failed) {
            Logger.log(this._errorMessage)
            Browser.msgBox(this._errorMessage)
            return ""
        }
        while (this._currentRowIndex <= this._rowCount) {
            if (isEven(this._currentRowIndex)) {
                this.addGroupToResult()
            }
            this._currentRowIndex++
        }
        return this.stringifyResults()
    }

    private stringifyResults(): string {
        if (this.result == null)      { return "{}" }
        if (this.result == undefined) { return "{}" }
        return JSON.stringify({
            keys: this.resultMap,
            values: this.result,
        })
    }

    private addGroupToResult(): any {
        const result:    any = {}
        const resultMap: any = {}

        const keys   = this.data[this._currentRowIndex]
        const values = this.data[this._currentRowIndex + 1]

        const keyLength = keys?.length
        if (!keyLength) {
            console.log({ message: "no keys" })
            return
        }

        for (let column = 0; column < keyLength; column++) {
            const key   = keys[column]
            const value = values[column]
            result[key] = value
            if ((key?.length ?? 0 ) > 0) {
                const A1 = `${columnToLetter(column + 1)}${this._currentRowIndex + 1}`
                console.log({
                    // currentRowIndex: this._currentRowIndex,
                    // column,
                    A1,
                    key,
                    // value,
                })
                resultMap[A1] = key
            }
        }

        this.result = {
            ...this.result,
            ...result,
        }
        this.resultMap = {
            ...this.resultMap,
            ...resultMap,
        }
    }
}
