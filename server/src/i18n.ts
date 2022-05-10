const defaultLanguage = "en";
const locales: any = {
  en: {
    cancel: "Cancel",
  },
  fr: {
    cancel: "Annuler",
  },
};

export const t = (language: string, key: string, variables: string[] = []) => {
  let str = locales[language]?.[key] || locales[defaultLanguage][key] || key;
  variables.forEach((v, i) => (str = str.replace("@" + (i + 1), v)));
  return str;
};
