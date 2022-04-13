import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { HookEvent, FrontEvent } from "./types";
import { getAccessToken, parseJwt } from "./utils";
import { chooseGif, sendGifMessage } from "./messages";
import config from "config";

export const cancel = async (event: any) => {
  const deletedMessage = event.content?.message
    ? event.content.message
    : {
        ephemeral: {
          id: event.id,
          recipient: event.user_id,
          recipient_context_id: event.recipient_context_id,
        },
        subtype: "deleted",
        id: undefined,
      };
  deletedMessage.subtype = "deleted";
  deletedMessage.id = undefined;

  await sendMessage(deletedMessage, {
    company_id: event.content?.message
      ? event.content.message.context.company_id
      : event.company_id,
    workspace_id: event.content?.message
      ? event.content.message.context.workspace_id
      : event.workspace_id,
    channel_id: event.content?.message
      ? event.content.message.context.channel_id
      : event.channel_id,
    thread_id: event.content?.message
      ? event.content.message.context.thread_id
      : event.thread_id,
  });
};

export const sendGif = async (event: FrontEvent) => {
  const msg = {
    subtype: "application",
    application_id: parseJwt(event.token).application_id,
    blocks: sendGifMessage(event.url, event.name),
    text: "sent a gif #" + event.name,
    user_id: event.user_id,
    context: { allow_delete: "everyone" },
  };

  cancel(event);

  await sendMessage(msg, {
    company_id: event.company_id,
    workspace_id: event.workspace_id,
    channel_id: event.channel_id,
    thread_id: event.thread_id,
  });
};

export const askGif = async (event: HookEvent) => {
  const context = {
    company_id: event.content.channel.company_id,
    workspace_id: event.content.channel.workspace_id,
    channel_id: event.content.channel.id,
    thread_id: event.content.parent_message
      ? event.content.parent_message.thread_id
      : null,
    user_id: event.user_id,
    user_name: [
      event.content.user?.first_name,
      event.content.user?.last_name,
    ].join(" "),
    user_icon: event.content.user?.icon,
    id: uuidv4(),
    recipient_context_id: event.connection_id,
    command: event.content?.command,
    token: await getAccessToken(),
  };

  const msg = {
    subtype: "application",
    blocks: chooseGif(event.content.user, context),
    ephemeral: {
      id: context.id,
      recipient: event.user_id,
      recipient_context_id: context.recipient_context_id,
    },
    context: {
      company_id: context.company_id,
      workspace_id: context.workspace_id,
      channel_id: context.channel_id,
    },
  };

  await sendMessage(msg, {
    company_id: context.company_id,
    workspace_id: context.workspace_id,
    channel_id: context.channel_id,
    thread_id: context.thread_id,
  });
};

//Send message
const sendMessage = async (
  message: any,
  options: {
    company_id: string;
    workspace_id: string;
    channel_id: string;
    thread_id?: string;
  }
) => {
  const url =
    config.get("credentials.endpoint") +
    (options.thread_id
      ? `/api/messages/v1/companies/${options.company_id}/threads/${options.thread_id}/messages`
      : `/api/messages/v1/companies/${options.company_id}/threads`);

  let data: any = {
    resource: message,
  };
  if (!options.thread_id) {
    data = {
      resource: {
        participants: [
          {
            type: "channel",
            id: options.channel_id,
            company_id: options.company_id,
            workspace_id: options.workspace_id,
          },
        ],
      },
      options: {
        message,
      },
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};
