defineCityTypes = () => {
  let types = [
    {
      city: "Vienna",
      country: "Austria",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Antwerp",
      country: "Belgium",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Sofia",
      country: "Bulgaria",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Plovdiv",
      country: "Bulgaria",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Varna",
      country: "Bulgaria",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Zagreb",
      country: "Croatia",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Prague",
      country: "Czech Republic",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Brno",
      country: "Czech Republic",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Copenhagen",
      country: "Denmark",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Aarhus",
      country: "Denmark",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Tallinn",
      country: "Estonia",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Helsinki",
      country: "Finland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Paris",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Marseille",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Lyon",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Toulouse",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Nice",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Nantes",
      country: "France",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Berlin",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Hamburg",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Munich",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Cologne",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Frankfurt",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Stuttgart",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Düsseldorf",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Leipzig",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Dortmund",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Essen",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bremen",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Dresden",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Hanover",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Nuremberg",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Duisburg",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bochum",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Wuppertal",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bielefeld",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bonn",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Münster",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Karlsruhe",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Mannheim",
      country: "Germany",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Athens",
      country: "Greece",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Thessaloniki",
      country: "Greece",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Budapest",
      country: "Hungary",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Dublin",
      country: "Ireland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Rome",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Milan",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Naples",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Turin",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Palermo",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Genoa",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bologna",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Florence",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bari",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Catania",
      country: "Italy",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Riga",
      country: "Latvia",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Vilnius",
      country: "Lithuania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Rotterdam",
      country: "Netherlands",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "The Hague",
      country: "Netherlands",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Utrecht",
      country: "Netherlands",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Warsaw",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Kraków",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Łódź",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Wrocław",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Poznań",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Gdańsk",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Szczecin",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bydgoszcz",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Lublin",
      country: "Poland",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Lisbon",
      country: "Portugal",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bucharest",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Iași",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Timișoara",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Cluj-Napoca",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Constanța",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Galați",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Craiova",
      country: "Romania",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bratislava",
      country: "Slovakia",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Madrid",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Barcelona",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Valencia",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Seville",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Zaragoza",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Málaga",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Murcia",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Palma de Mallorca",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Las Palmas",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Bilbao",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Alicante",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Córdoba",
      country: "Spain",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Stockholm",
      country: "Sweden",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Gothenburg",
      country: "Sweden",
      types: [{ first: "city", second: "", third: "" }],
    },
    {
      city: "Malmö",
      country: "Sweden",
      types: [{ first: "city", second: "", third: "" }],
    },
  ];
  return types;
};
