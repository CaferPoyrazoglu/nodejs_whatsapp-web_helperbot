const SESSION_FILE_PATH = "./session.json";
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client } = require("whatsapp-web.js");
const envfile = require("envfile");
const sourcePath = ".env";
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
  //console.log("Client is ready!");
});

client.on("ready", () => {
  console.log("Gruba katılım bekleniyor!");
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

client.on("group_join", async (notification) => {
  let parsedFile = envfile.parseFileSync(sourcePath);
  parsedFile.GROUP = notification.id.remote;
  fs.writeFileSync("./.env", envfile.stringifySync(parsedFile));

  console.log("Grup bilgisi kaydedildi!");
  console.log("Program 5 saniye sonra kapatılacak!");
  await sleep(5000);
  process.exit(1);
});

client.initialize();
