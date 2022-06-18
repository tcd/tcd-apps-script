const addMenuItem = (name, functionName) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tsvMenuEntries = [ {
        name: name,
        functionName: functionName
    } ];
    ss.addMenu(MENU_NAME, tsvMenuEntries);
};

const NEWLINE = "\n";

const MENU_NAME = "tcd";

const FOLDER_ID = "1Vhw0UvGogfuhTko2Bc9Dql807_YB3uHn";

const isEven = n => n == 0 || n % 2 == 0;

const timestamp = (time = null) => {
    time !== null && time !== void 0 ? time : time = new Date;
    const year = time.getFullYear();
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const day = time.getDate().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    const _hour = time.getHours();
    const meridiemIndicator = _hour > 12 ? "PM" : "AM";
    const hour = ((_hour + 11) % 12 + 1).toString().padStart(2, "0");
    return `${year}-${month}-${day}_${hour}-${minute}-${second}_${meridiemIndicator}`;
};

const convertRangeToTsvFile = sheet => {
    const activeRange = sheet.getDataRange();
    try {
        const data = activeRange.getValues();
        const formulas = activeRange.getFormulas();
        let tsvFile = "";
        if (!(data.length > 1)) {
            return tsvFile;
        }
        let tsv = "";
        for (let row = 0; row < data.length; row++) {
            for (let col = 0; col < data[row].length; col++) {
                let cell = data[row][col];
                const formula = formulas[row][col];
                if (formula !== "") {
                    cell = formula !== null && formula !== void 0 ? formula : "";
                }
                cell = cell.replaceAll(/"/g, '"');
                cell = cell.replaceAll(/\s*(\n)|(\r\n)\s*/g, " ");
                cell = `"${cell}"`;
                data[row][col] = cell;
            }
            tsv += data[row].join("\t") + NEWLINE;
        }
        tsvFile = tsv;
        return tsvFile;
    } catch (err) {
        Logger.log(err);
        Browser.msgBox(err);
        return "";
    }
};

const saveAsTsv = () => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const newFolderName = ss.getName().toLowerCase().replace(/   /g, "_") + "_tsv_" + timestamp();
    const parentFolder = DriveApp.getFolderById(FOLDER_ID);
    const folder = parentFolder.createFolder(newFolderName);
    const sheets = ss.getSheets();
    for (const sheet of sheets) {
        const fileName = `${sheet.getName()}.tsv`;
        const tsvFile = convertRangeToTsvFile(sheet);
        folder.createFile(fileName, tsvFile);
    }
    Browser.msgBox(`Files are waiting in a folder named ${parentFolder}/${newFolderName}`);
};

class Parser {
    constructor(sheet) {
        var _a, _b, _c;
        this._failed = false;
        this._errorMessage = "";
        this._currentRowIndex = 0;
        this.result = {};
        this.sheet = sheet;
        this.range = (_a = this.sheet) === null || _a === void 0 ? void 0 : _a.getDataRange();
        this.formulas = (_b = this.range) === null || _b === void 0 ? void 0 : _b.getFormulas();
        this.data = (_c = this.range) === null || _c === void 0 ? void 0 : _c.getValues();
        this._rowCount = this.data.length;
        if (!(this._rowCount > 1)) {
            this._failed = true;
            this._errorMessage = "No data found in current sheet";
            return;
        }
    }
    process() {
        if (this._failed) {
            Logger.log(this._errorMessage);
            Browser.msgBox(this._errorMessage);
            return "";
        }
        while (this._currentRowIndex <= this._rowCount) {
            if (isEven(this._currentRowIndex)) {
                this.addGroupToResult();
            }
            this._currentRowIndex++;
        }
        return this.stringifyResult();
    }
    stringifyResult() {
        if (this.result == null) {
            return "{}";
        }
        if (this.result == undefined) {
            return "{}";
        }
        return JSON.stringify(this.result);
    }
    addGroupToResult() {
        const result = {};
        const keys = this.data[this._currentRowIndex];
        const values = this.data[this._currentRowIndex + 1];
        const keyLength = keys === null || keys === void 0 ? void 0 : keys.length;
        if (!keyLength) {
            console.log({
                message: "no keys"
            });
            return;
        }
        for (let i = 0; i < keyLength; i++) {
            const key = keys[i];
            const value = values[i];
            result[key] = value;
        }
        this.result = {
            ...this.result,
            ...result
        };
    }
}

const saveAsJson = () => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const newFolderName = ss.getName().toLowerCase().replace(/   /g, "_") + "_json_" + timestamp();
    const parentFolder = DriveApp.getFolderById(FOLDER_ID);
    const folder = parentFolder.createFolder(newFolderName);
    const sheet = ss.getActiveSheet();
    const fileName = `${sheet.getName()}.json`;
    const content = new Parser(sheet).process();
    console.log(content);
    folder.createFile(fileName, content);
    Browser.msgBox(`Files are waiting in a folder named ${parentFolder}/${newFolderName}`);
};

function onOpen(_event) {
    addMenuItem("Export as JSON v3", "saveAsJson");
}
