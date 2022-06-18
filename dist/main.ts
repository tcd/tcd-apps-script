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
    return `${year}-${month}-${day}--${hour}-${minute}-${second}-${meridiemIndicator}`;
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
                    cell = formula;
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

function onOpen(_event) {
    addMenuItem("Export as TSV v7", "saveAsTsv");
}
