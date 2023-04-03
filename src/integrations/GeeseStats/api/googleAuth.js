import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'

const IS_CLOUD_DEPLOY = process.env.IS_CLOUD_DEPLOY || false

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const SERVICE_KEY_PATH = path.join(process.cwd(), 'service_key.json')

async function loadCredentials() {
  if (!IS_CLOUD_DEPLOY) {
    const serviceKey = await fs.readFile(SERVICE_KEY_PATH)
    return JSON.parse(serviceKey)
  }

  const encodedKey = process.env.GOOGLE_SERVICE_KEY_BASE64
  const decoded = Buffer.from(encodedKey, 'base64').toString('utf-8')

  return JSON.parse(decoded)
}
/**
 * Load or request or authorization to call APIs.
 *
 */
export async function authorize() {
  const credentials = await loadCredentials()
  const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES })
  const client = await auth.getClient()

  return client
}
