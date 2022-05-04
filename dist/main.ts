const NEWLINE = "\n";

const MENU_NAME = "tcd";

const FOLDER_ID = "1Vhw0UvGogfuhTko2Bc9Dql807_YB3uHn";

const addMenuItem = (name, functionName) => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tsvMenuEntries = [ {
        name: name,
        functionName: functionName
    } ];
    ss.addMenu(MENU_NAME, tsvMenuEntries);
};

const saveAsTsv = () => {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const parentFolder = DriveApp.getFolderById(FOLDER_ID);
    const folder = parentFolder.createFolder(ss.getName().toLowerCase().replace(/   /g, "_") + "_tsv_" + (new Date).getTime());
    for (const sheet of sheets) {
        const fileName = sheet.getName() + ".tsv";
        const tsvFile = convertRangeToTsvFile(sheet);
        folder.createFile(fileName, tsvFile);
    }
    Browser.msgBox("Files are waiting in a folder named " + folder.getName());
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

function onOpen(_event) {
    addMenuItem("Export as TSV 7", "saveAsTsv");
}
