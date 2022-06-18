import { MENU_NAME } from ".."

/**
 * When a new sheet is opened, add a menu for our functions
 */
export const addMenuItem = (name: string, functionName: string): void => {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const tsvMenuEntries = [{
        name: name,
        functionName: functionName,
    }]
    ss.addMenu(MENU_NAME, tsvMenuEntries)
}
