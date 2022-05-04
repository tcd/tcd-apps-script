const MENU_NAME = "tcd";

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
    const folder = DriveApp.createFolder(ss.getName().toLowerCase().replace(/   /g, "_") + "_tsv_" + (new Date).getTime());
    for (const sheet of sheets) {
        const fileName = sheet.getName() + ".tsv";
        const tsvFile = convertRangeTotsvFile(sheet);
        folder.createFile(fileName, tsvFile);
    }
    Browser.msgBox("Files are waiting in a folder named " + folder.getName());
};

const convertRangeTotsvFile = sheet => {
    const activeRange = sheet.getDataRange();
    try {
        const data = activeRange.getValues();
        const formula = activeRange.getFormulas();
        let tsvFile = "";
        if (data.length > 1) {
            let tsv = "";
            for (let row = 0; row < data.length; row++) {
                for (let col = 0; col < data[row].length; col++) {
                    if (formula[row][col] !== "") {
                        data[row][col] = formula[row][col];
                    }
                    if (data[row][col].toString().indexOf("\t") != -1) {
                        data[row][col] = '"' + data[row][col] + '"';
                    }
                }
                if (row < data.length - 1) {
                    tsv += data[row].join("\t") + "\r\n";
                } else {
                    tsv += data[row].join("\t");
                }
            }
            tsvFile = tsv;
        }
        return tsvFile;
    } catch (err) {
        Logger.log(err);
        Browser.msgBox(err);
        return "";
    }
};

function onOpen(_event) {
    addMenuItem("Export as TSV", "saveAstsv");
}
