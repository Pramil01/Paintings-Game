const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const serviceAccountKeyFile = "./dolphins-343115-a82d61a2ee9d.json";
const sheetId = "1K4BSLhYaBI8KkYY_XmgspheRCjgy4DDxiaDw4QvQz6o";
const tabName = "Paintings";

router.get("/", async (req, res) => {
  const id = req.query.id;
  const value = await getDetails(id);
  res.json(value);
});

router.post("/", async (req, res) => {
  const { id, email, username, sEmail } = req.body;
  const newData = await makePurchase(id, email, username, sEmail);
  res.json(newData);
});

async function getDetails(id) {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    "A:F"
  );
  let currTime = new Date().getTime();
  for (let i = 0; i < data.length; i++) {
    if (id === data[i][0]) {
      if (data[i][1] !== "51") {
        let n = parseInt((currTime - parseInt(data[i][3])) / (1000 * 60 * 10));
        let midValue = parseFloat(parseInt(data[i][1]) * Math.pow(0.919, n));
        data[i][1] = midValue < 33 ? 33 : midValue;
      }
      return { details: data[i] };
    }
  }
}

async function makePurchase(id, email, username, sEmail) {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();

  // Reading Google Sheet from a specific range
  const data = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    "A:F"
  );

  let currTime = new Date().getTime();
  const toSet = {
    newValue: "",
    newOwner: username + ":" + email,
    timestamp: currTime,
    high_sold: "",
    min_bought: "",
  };

  let midValue,
    i = 0;
  for (; i < data.length; i++) {
    if (id === data[i][0]) {
      if (data[i][1] === "51") {
        midValue = 51;
      } else {
        let n = parseInt((currTime - parseInt(data[i][3])) / (1000 * 60 * 10));
        midValue = parseFloat(parseInt(data[i][1]) * Math.pow(0.919, n));
        midValue = midValue < 33 ? 33 : midValue;
      }
      let hike = parseFloat((100 - midValue) * 0.37);
      toSet.newValue = midValue + hike;
      toSet.min_bought = Math.min(midValue, data[i][5]);
      toSet.high_sold = Math.max(midValue, data[i][4]);
      break;
    }
  }

  const dataToBeInserted = [
    [
      toSet.newValue,
      toSet.newOwner,
      toSet.timestamp,
      toSet.high_sold,
      toSet.min_bought,
    ],
  ];

  await _updateGoogleSheet(
    googleSheetClient,
    sheetId,
    tabName,
    `B${i + 1}:F${i + 1}`,
    dataToBeInserted
  );

  const dataMoney = await _readGoogleSheet(
    googleSheetClient,
    sheetId,
    "Players",
    "A:D"
  );

  let newBalance,
    check = sEmail === "None";
  for (let i = 0; i < dataMoney.length; i++) {
    if (sEmail === dataMoney[i][1] && sEmail !== "None") {
      await _updateGoogleSheet(
        googleSheetClient,
        sheetId,
        "Players",
        `D${i + 1}:D${i + 1}`,
        [[parseInt(dataMoney[i][3]) + midValue]]
      );
      if (check) break;
      else check = true;
    }
    if (email === dataMoney[i][1]) {
      newBalance = parseInt(dataMoney[i][3]) - midValue;
      await _updateGoogleSheet(
        googleSheetClient,
        sheetId,
        "Players",
        `D${i + 1}:D${i + 1}`,
        [[newBalance]]
      );
      if (check) break;
      else check = true;
    }
  }

  return {
    newData: dataToBeInserted,
    newBalance,
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

async function _updateGoogleSheet(
  googleSheetClient,
  sheetId,
  tabName,
  range,
  data
) {
  await googleSheetClient.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      majorDimension: "ROWS",
      values: data,
    },
  });
}

module.exports = router;
