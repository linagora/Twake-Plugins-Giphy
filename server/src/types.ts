export type HookEvent = {
  type: "action" | "interactive_message_action" | "hook";
  name?: string;
  connection_id?: string;
  user_id?: string;
  content: {
    command?: string;
    channel?: any;
    parent_message?: any;
    message?: any;
    user?: {
      preferences: {
        locale: string;
      };
      first_name: string;
      last_name: string;
      icon: string;
    };
  };
};

export type FrontEvent = {
  url: string;
  name: string;
  company_id: string;
  workspace_id: string;
  channel_id: string;
  thread_id: string;
  user_id: string;
  user_name: string;
  user_icon: string;
  context: any;
  token: string;
  id?: string;
  recipient_context_id?: string;
};
