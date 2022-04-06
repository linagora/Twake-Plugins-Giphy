const defaultLanguage = "en";
const locales: any = {
  en: {
    join_call: "Join call",
    invite_text: "@1 invite you to join the call:",
    confirm_text: "You are going to create a call in the room '@1'.",
    confirm: "Confirm",
    cancel: "Cancel",
  },
  fr: {
    join_call: "Rejoindre l'appel",
    invite_text: "@1 vous invite dans l'appel :",
    confirm_text: "Vous allez créer un appel dans l'espace '@1'.",
    confirm: "Confirmer",
    cancel: "Anuler",
  },
};

export const t = (language: string, key: string, variables: string[] = []) => {
  let str = locales[language][key] || locales[defaultLanguage][key] || key;
  variables.forEach((v, i) => (str = str.replace("@" + (i + 1), v)));
  return str;
};
