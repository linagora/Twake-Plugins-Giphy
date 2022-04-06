import { HookEvent } from "./types";
import { t } from "./i18n";

export const chooseGiff = (
  user: HookEvent["content"]["user"],
  context: any
) => {
  const lang = user?.preferences.locale || "";
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "iframe",
          height: "40vh",
          src: `http://localhost:8003/front?company_id=${
            context.company_id
          }&workspace_id=${context.workspace_id}${
            context.thread_id ? `&thread_id=${context.thread_id}` : ""
          }&channel_id=${context.channel_id}&user_id=${
            context.user_id
          }&user_name=${context.user_name}${
            context.user_icon ? `&user_icon=${context.user_icon}` : ""
          }&id=${context.id}&recipient_context_id=${
            context.recipient_context_id
          }${context.command ? `&command=${context.command}` : ""}`,
        },
        { type: "br" },
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

export const sendGiffMessage = (url: string) => {
  return [
    {
      type: "twacode",
      elements: [
        {
          type: "system",
          content: "Giff url : ",
        },
        {
          type: "system",
          content: {
            inline: "true",
            type: "url",
            content: url,
          },
        },
        { type: "br" },
        {
          type: "image",
          src: url,
        },
      ],
    },
  ];
};
