import express from "express";
import config from "config";
import { FrontEvent, HookEvent } from "./types";
import { askGif, cancel, sendGif } from "./events";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";
const prefix_conf = config.get("server.prefix");
const prefix =
  (prefix_conf ? "/" : "") +
  ((prefix_conf || "") as string).replace(/(^\/|\/$)/g, "");

const app = express();
app.use(express.json());
app.use(prefix + "/view", express.static(__dirname + "/../../client/build"));

app.use(prefix + "/assets", express.static(__dirname + "/../assets"));

app.post(prefix + "/send", async (req, res) => {
  const event = req.body as FrontEvent;
  const token: string = event.context;

  try {
    jwt.verify(
      (jwt.decode(token) as FrontEvent).token,
      (config.get("credentials.secret") as string).toString()
    );
  } catch (err) {
    res.status(401).send("Unauthorized");

    return;
  }

  res.send(await sendGif(event));
});

// Entrypoint for every events comming from Twake
app.post(prefix + "/hook", async (req, res) => {
  const event = req.body as HookEvent;
  const signature = req.headers["x-twake-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", config.get("credentials.secret"))
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    res.status(403).send({ error: "Wrong signature" });
    return;
  }
  if (
    (event.type === "action" && event.name === "open") ||
    (event.type === "action" && event.name === "command")
  ) {
    return res.send(await askGif(event));
  } else if (
    event.type === "interactive_message_action" &&
    event.name === "cancel"
  ) {
    return res.send(await cancel(event));
  }

  res.send({ error: "Not implemented" });
});

const port = config.get("server.port");
app.listen(port, (): void => {
  console.log(`Plugin started on port ${port}`);
});
