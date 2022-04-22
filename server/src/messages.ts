import { HookEvent } from "./types";
import { t } from "./i18n";
import config from "config";
import jwt from "jsonwebtoken";

const prefix =
  (config.get("server.prefix") ? "/" : "") +
  ((config.get("server.prefix") || "") as string).replace(/(^\/|\/$)/g, "");

const origin = ((config.get("server.origin") || "") as string).replace(
  /(^\/|\/$)/g,
  ""
);

export const chooseGif = (user: HookEvent["content"]["user"], context: any) => {
  const lang = user?.preferences.locale || "";
  const payload = {
    company_id: context.company_id,
    workspace_id: context.workspace_id,
    thread_id: context.thread_id ? context.thread_id : "",
    channel_id: context.channel_id,
    user_id: context.user_id,
    user_name: context.user_name,
    user_icon: context.user_icon ? context.user_icon : "",
    id: context.id,
    recipient_context_id: context.recipient_context_id,
    command: context.command ? context.command : "",
    token: context.token,
  };

  const contextUrl = jwt.sign(
    JSON.stringify(payload),
    config.get("credentials.secret")
  );
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "iframe",
          height: "40vh",
          src: origin + prefix + `/view?context=${contextUrl}`,
        },
        {
          type: "button",
          style: "default",
          action_id: "cancel",
          content: t(lang, "cancel"),
        },
      ],
    },
  ];
};

export const sendGifMessage = (url: string, name: string) => {
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "image",
          src: url,
        },
      ],
    },
  ];
};
