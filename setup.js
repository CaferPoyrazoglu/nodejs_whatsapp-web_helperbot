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

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message", async (msg) => {
  console.log("MESSAGE RECEIVED", msg);

  if (msg.body === "Dosya") {
    let chat = await msg.getChat();
    const media = MessageMedia.fromFilePath("D://a.png");
    chat.sendMessage(media);
  }
});

client.on("message_create", (msg) => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  console.log(after); // message after it was deleted.
  if (before) {
    console.log(before); // message before it was deleted.
  }
});

client.on("message_revoke_me", async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  console.log(msg.body); // message before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
      == ACK VALUES ==
      ACK_ERROR: -1
      ACK_PENDING: 0
      ACK_SERVER: 1
      ACK_DEVICE: 2
      ACK_READ: 3
      ACK_PLAYED: 4
  */

  if (ack == 3) {
    // The message was read
  }
});

client.on("group_join", (notification) => {
  // User has joined or been added to the group.
  console.log("join", notification);
  notification.reply("User joined.");
});

client.on("group_leave", (notification) => {
  // User has left or been kicked from the group.
  console.log("leave", notification);
  notification.reply("User left.");
});

client.on("group_update", (notification) => {
  // Group picture, subject or description has been updated.
  console.log("update", notification);
});

client.on("change_battery", (batteryInfo) => {
  // Battery percentage for attached device has changed
  const { battery, plugged } = batteryInfo;
  console.log(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on("change_state", (state) => {
  console.log("CHANGE STATE", state);
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

client.initialize();
