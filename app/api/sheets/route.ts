import { google } from "googleapis";
import { NextResponse } from "next/server";

const getSheets = async () => {

  const credentials = JSON.parse(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    credentials: credentials,
  });

  const sheets = google.sheets({ version: "v4", auth });
  const resSheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.SHEET_ID,
    fields: "sheets(properties(title))"
  });

  return resSheet.data.sheets;
}

export async function GET(request: Request) {
  const res = await getSheets();

  return NextResponse.json(res);
}