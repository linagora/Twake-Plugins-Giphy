import express from "express";
import config from "config";
import { FrontEvent, HookEvent } from "./types";
import { askGiff, cancel, sendGiff } from "./events";

const app = express();
app.use(express.json());
app.use("/front", express.static(__dirname + "/../../client/build"));

app.post(config.get("server.prefix") + "/send", async (req, res) => {
  const event = req.body as FrontEvent;
  res.send(await sendGiff(event));
});

// Entrypoint for every events comming from Twake
app.post(config.get("server.prefix") + "/hook", async (req, res) => {
  const event = req.body as HookEvent;

  if (
    (event.type === "action" && event.name === "open") ||
    (event.type === "action" && event.name === "command")
  ) {
    return res.send(await askGiff(event));
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
