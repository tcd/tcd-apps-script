import { addMenuItem, saveAsTsv } from "./lib"

export { saveAsTsv }

/**
 * The event handler triggered when opening the spreadsheet.
 * @param {GoogleAppsScript.Events.SheetsOnOpen} ) _event The onOpen event.
 * @see https://developers.google.com/apps-script/guides/triggers#onopene
 */
export function onOpen(_event: GoogleAppsScript.Events.SheetsOnOpen) {
    addMenuItem("Export as TSV v7", "saveAsTsv")
    // addMenuItem("Export as JSON v1", "saveAsJson")
}
