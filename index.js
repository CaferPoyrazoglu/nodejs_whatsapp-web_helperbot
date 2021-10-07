const qrcode = require("qrcode-terminal");
const fs = require("fs");
const { Client, MessageMedia } = require("whatsapp-web.js");

const SESSION_FILE_PATH = "./session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionCfg,
});

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
  console.log("Sunucu Hazir!");
});

client.on("auth_failure", (msg) => {
  console.error("Dogrulama Hatasi!", msg);
});

client.on("ready", () => {
  console.log("Calisiyor!");
});

client.on("message", async (msg) => {
  let chat = await msg.getChat();

  if (
    chat.isGroup &&
    msg.body === "Rapor" &&
    msg.id.remote === "905494032745-1633642858@g.us"
  ) {
    const media = MessageMedia.fromFilePath("D://rapor.xlsx");
    chat.sendMessage(media);
  }
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

client.initialize();
