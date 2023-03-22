const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { google } = require("googleapis");

const serviceAccountKeyFile = "./dolphins-343115-a82d61a2ee9d.json";
const sheetId = "1K4BSLhYaBI8KkYY_XmgspheRCjgy4DDxiaDw4QvQz6o";
const tabName = "Players";
const range = "A:D";

router.post("/", async (req, res) => {
  const { username, password, email } = req.body;
  bcrypt.hash(password, 10).then(async (hash) => {
    const value = await signUp(username, hash, email);
    if (value.type === "error") res.status(409).json(value);
    else {
      res.json(value);
      console.log(value.msg);
    }
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await logIn(email);

  if (user.type === "error") res.status(403).json({ msg: user.msg });
  else {
    bcrypt.compare(password, user.details[2]).then((match) => {
      if (!match) res.status(401).json({ msg: "wrong username or password" });
      else {
        res.json({
          details: { username: user.details[0], worth: user.details[3] },
        });
      }
    });
  }
});

async function signUp(username, password, email) {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    "B:B"
  );
  for (let i = 0; i < data.length; i++) {
    if (email === data[i][0])
      return {
        type: "error",
        msg: "Email already exists",
      };
  }

  // Adding a new row to Google Sheet
  const dataToBeInserted = [[username, email, password, 100]];
  await _writeGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    range,
    dataToBeInserted
  );

  return {
    type: "success",
    msg: "Player Created",
  };
}

async function logIn(email) {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    range
  );

  for (let i = 0; i < data.length; i++) {
    if (email === data[i][1])
      return {
        type: "success",
        details: data[i],
      };
  }
  return {
    type: "error",
    msg: "User not found",
  };
}

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: authClient,
  });
}

async function _readGoogleSheet(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
  });

  return res.data.values;
}

async function _writeGoogleSheet(
  googleSheetClient,
  sheetId,
  tabName,
  range,
  data
) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      majorDimension: "ROWS",
      values: data,
    },
  });
}

module.exports = router;
