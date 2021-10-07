const SESSION_FILE_PATH = "./session.json";
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client, MessageMedia } = require("whatsapp-web.js");

const client = new Client({});

client.on("authenticated", (session) => {
  sessionData = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      console.error(err);
    }
  });
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("ready", () => {
  console.log("READY");
  process.exit(1);
});

client.initialize();
