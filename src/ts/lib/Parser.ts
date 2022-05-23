import {
    isEven,
} from "./isEven"

// https://developers.google.com/apps-script/reference/spreadsheet/range
export class Parser {

    public sheet: GoogleAppsScript.Spreadsheet.Sheet
    public range: GoogleAppsScript.Spreadsheet.Range
    public data: any[][]
    public formulas: string[][]
    public result: any

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
        return JSON.stringify(this.result)
    }

    private addGroupToResult(): any {
        const result: any = {}
        const keys   = this.data[this._currentRowIndex]
        const values = this.formulas[this._currentRowIndex + 1]
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = values[i]
            result[key] = value
        }
        this.result = {
            ...this.result,
            ...result,
        }
    }
}
