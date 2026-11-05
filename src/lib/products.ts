import { messages } from "./i18n";
export const categories = [
  "phones",
  "tablets",
  "audio",
  "watches",
  "gaming",
  "homeTech",
] as const;
export type Category = (typeof categories)[number];
export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  model: string;
  demoPrice: number;
  storage?: string[];
  colors: string[];
  art: string;
  sourceUrl: null;
  storeReference: string;
  checkedAt: string;
  dataStatus: "demo";
  availability: "unverified";
};
const rows: [string, string, Category, number, string, string[]?, string[]?][] =
  [
    [
      "iPhone 17 Pro",
      "Apple",
      "phones",
      2799,
      "phone-orange",
      ["256 GB", "512 GB"],
      ["#bc663a", "#c3c6c7", "#3a444f"],
    ],
    [
      "Galaxy S25 Ultra",
      "Samsung",
      "phones",
      2499,
      "phone-silver",
      ["256 GB", "512 GB"],
      ["#abb3b5", "#333c40"],
    ],
    [
      "AirPods Max",
      "Apple",
      "audio",
      1149,
      "headphones",
      undefined,
      ["#acc0d0", "#aaa69e", "#424449"],
    ],
    [
      "iPad Air",
      "Apple",
      "tablets",
      1399,
      "tablet",
      ["128 GB", "256 GB"],
      ["#b5adcb", "#b7c6cc"],
    ],
    [
      "Apple Watch Series 10",
      "Apple",
      "watches",
      899,
      "watch",
      undefined,
      ["#41484b", "#c8bba7"],
    ],
    [
      "PlayStation 5",
      "Sony",
      "gaming",
      1199,
      "console",
      undefined,
      ["#e4e8eb"],
    ],
    [
      "Supersonic",
      "Dyson",
      "homeTech",
      949,
      "dryer",
      undefined,
      ["#ba6680", "#7a648f"],
    ],
    [
      "Galaxy Buds3 Pro",
      "Samsung",
      "audio",
      379,
      "earbuds",
      undefined,
      ["#babfc4"],
    ],
    [
      "Galaxy Tab S10",
      "Samsung",
      "tablets",
      1699,
      "tablet",
      ["256 GB", "512 GB"],
      ["#909ca4"],
    ],
    ["Mini 4 Pro", "DJI", "homeTech", 1899, "drone", undefined, ["#b7b9b8"]],
    ["Qrevo", "Roborock", "homeTech", 1299, "vacuum", undefined, ["#dde0dc"]],
    [
      "Galaxy Watch7",
      "Samsung",
      "watches",
      499,
      "watch",
      undefined,
      ["#64786c"],
    ],
  ];
export const products: Product[] = rows.map(
  ([name, brand, category, demoPrice, art, storage, colors], index) => ({
    id: `demo-${index + 1}`,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    name,
    brand,
    category,
    model: name,
    demoPrice,
    art,
    storage,
    colors: colors || ["#aaa"],
    sourceUrl: null,
    storeReference: "https://tap.az/shops/okmobile",
    checkedAt: "2026-11-05",
    dataStatus: "demo",
    availability: "unverified",
  }),
);
export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);
export function money(value: number, locale: string) {
  return (
    new Intl.NumberFormat(
      locale === "az" ? "az-AZ" : locale === "ru" ? "ru-RU" : "en-US",
      { maximumFractionDigits: 0 },
    ).format(value) + " ₼"
  );
}
export type Filters = {
  q?: string;
  category?: string;
  brand?: string;
  storage?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};
export function filterProducts(filters: Filters) {
  const term = (filters.q || "").trim().toLocaleLowerCase();
  const min = Number(filters.min) || 0;
  const max = filters.max ? Number(filters.max) : Infinity;
  const result = products.filter(
    (p) =>
      (!term ||
        `${p.name} ${p.brand} ${p.category} ${Object.values(messages)
          .map((m) => m[p.category])
          .join(" ")}`
          .toLocaleLowerCase()
          .includes(term)) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.brand || p.brand === filters.brand) &&
      (!filters.storage || p.storage?.includes(filters.storage)) &&
      p.demoPrice >= min &&
      p.demoPrice <= (Number.isFinite(max) ? max : Infinity),
  );
  return result.sort((a, b) =>
    filters.sort === "priceLow"
      ? a.demoPrice - b.demoPrice
      : filters.sort === "priceHigh"
        ? b.demoPrice - a.demoPrice
        : filters.sort === "name"
          ? a.name.localeCompare(b.name)
          : 0,
  );
}
