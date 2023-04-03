import { authorize } from './googleAuth'
import { google } from 'googleapis'

const ROOT_SPREADSHEET_ID = import.meta.env.ROOT_GOOGLE_SHEETS_ID

const initAPI = async auth => google.sheets({ version: 'v4', auth })

const sheetsAPI = authorize().then(initAPI)

export async function getAllSpreadsheets() {
  const res = await sheetsAPI.spreadsheets.get({
    spreadsheetId: ROOT_SPREADSHEET_ID,
  })

  return res.data.sheets.map(sheet => sheet.properties)
}

const buildRangeStr = (sheet, range) => `'${sheet.title}'!${range}`

export async function getSheetRange(sheet, range) {
  const rangeStr = buildRangeStr(sheet, range)

  const res = await sheetsAPI.spreadsheets.values.get({
    spreadsheetId: ROOT_SPREADSHEET_ID,
    range: rangeStr,
  })

  return res.data
}

export async function getBatchSheetRange(sheet, ranges) {
  const rangeStrs = ranges.map(range => buildRangeStr(sheet, range))

  const res = await sheetsAPI.spreadsheets.values.batchGet({
    spreadsheetId: ROOT_SPREADSHEET_ID,
    ranges: rangeStrs,
  })

  return res.data.valueRanges.map(({ values }) => values)
}

export async function getNamedSheetRanges(sheet, namedRanges) {
  const sheetValues = await getBatchSheetRange(
    sheet,
    Object.values(namedRanges)
  )
  const dataNames = Object.keys(namedRanges)

  const namedData = sheetValues.reduce((namedObj, values, idx) => {
    const name = dataNames[idx]
    namedObj[name] = values?.map(value => value).filter(v => v.length) || null

    return namedObj
  }, {})

  return namedData
}

export default await sheetsAPI
