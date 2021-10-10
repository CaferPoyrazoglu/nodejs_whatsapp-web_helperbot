const qrcode = require("qrcode-terminal");
const fs = require("fs");
const parse = require("csv-parse");
const { Client, MessageMedia } = require("whatsapp-web.js");
require("dotenv/config");

const SESSION_FILE_PATH = "./session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionCfg,
});

client.initialize();

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on("qr", (qr) => {
  qrcode.generate(qr, {
    small: true,
  });
});

client.on("ready", () => {
  //console.log("Sunucu Hazir!");
});

client.on("auth_failure", (msg) => {
  console.error("Dogrulama Hatasi!", msg);
});

client.on("message_create", (msg) => {
  if (msg.fromMe) {
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  console.log(after);
  if (before) {
    console.log(before);
  }
});

client.on("message_revoke_me", async (msg) => {
  console.log(msg.body);
});

client.on("message_ack", (msg, ack) => {
  if (ack == 3) {
  }
});

client.on("group_join", (notification) => {
  console.log("join", notification);
});

client.on("group_leave", (notification) => {
  console.log("leave", notification);
});

client.on("group_update", (notification) => {
  console.log("update", notification);
});

client.on("change_battery", (batteryInfo) => {
  const { battery, plugged } = batteryInfo;
  console.log(`Pil Durumu: ${battery}% - Sarj oluyor! ${plugged}`);
});

client.on("change_state", (state) => {
  console.log("Durum degisti: ", state);
});

client.on("disconnected", (reason) => {
  console.log("Cikis yapildi!", reason);
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

client.on("ready", async () => {
  console.log("Rapor 5 saniye sonra gruba iletilecek!");
  await sleep(5000);

  var csvData = [];
  fs.createReadStream(process.env.KAYNAK)
    .pipe(
      parse({
        relaxColumnCount: true,
        skipEmptyLines: true,
        skip_lines_with_empty_values: true,
        skipLinesWithEmptyValues: true,
      })
    )
    .on("data", function (csvrow) {
      csvData.push(csvrow[1]);
    })
    .on("end", function () {
      //console.log(csvData);
      client.sendMessage(
        process.env.GROUP,
        `*DÖNER FIRIN - 1*\r\nÜretilen Klinker Miktarı: ${csvData[1]} ton\r\n
*DÖNER FIRIN - 2*\r\nÜretilen Klinker Miktarı: ${csvData[2]} ton\r\n\r\n
*TOPLAM:* ${csvData[3]} ton\r\n`
      );

      client.sendMessage(
        process.env.GROUP,
        `*ÇİMENTO DEĞİRMENİ - 1*\r\nÜretilen Çimento Miktarı: ${csvData[5]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 2*\r\nÜretilen Çimento Miktarı: ${csvData[6]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 3*\r\nÜretilen Çimento Miktarı: ${csvData[7]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 4*\r\nÜretilen Çimento Miktarı: ${csvData[8]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 5*\r\nÜretilen Çimento Miktarı: ${csvData[9]} ton\r\n\r\n
*TOPLAM:* ${csvData[10]} ton\r\n`
      );

      client.sendMessage(
        process.env.GROUP,
        `*ÇİMENTO DEĞİRMENİ - 1*\r\nTüketilen Klinker Miktarı: ${csvData[12]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 2*\r\nTüketilen Klinker Miktarı: ${csvData[13]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 3*\r\nTüketilen Klinker Miktarı: ${csvData[14]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 4*\r\nTüketilen Klinker Miktarı: ${csvData[15]} ton\r\n
*ÇİMENTO DEĞİRMENİ - 5*\r\nTüketilen Klinker Miktarı: ${csvData[16]} ton\r\n\r\n
*TOPLAM:* ${csvData[17]} ton\r\n`
      );
    });
  console.log("İletildi!");
  await sleep(1000);
  console.log("Program 5 saniye sonra kapatılacak!");
  await sleep(5000);
  process.exit(1);
});
