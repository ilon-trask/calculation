const Docs = [
  {
    id: 1,
    name: "Набір робіт, матеріалів та послуг",
  },
  {
    id: 2,
    name: "Дефектний акт (скорочений)",
  },
  {
    id: 3,
    name: "Калькуляція (скорочена)",
  },
  {
    id: 4,
    name: "Рахунок фактура",
  },
] as const;
export type DocsType = (typeof Docs)[number]["name"];
export { Docs };
