const puppeteer = require("puppeteer");

require("./city_list");
const fsLibrary = require("fs");

const baseURL = "https://www.lonelyplanet.com";
const transport_end_url = "transportation";

const file = "descriptions_all_extended.txt";

appendToFile = (file, data) => {
  fsLibrary.appendFile(file, data, (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
};

async function readText(page, xPath) {
  let [element] = await page.$x(xPath);
  let element_text = await element.getProperty("textContent");
  element_text = await element_text.jsonValue();
  return element_text;
}
async function scrapePage(page, country, city) {
  const [error_page] = await page.$x('//*[@id="__next"]/div/div/h1');
  if (!error_page) {
    console.log("success for: ", country, city);
    const button =
      "#introduction > div.jsx-3380108488.introduction.mx-auto > p > button";

    try {
      // click the read more button
      await page.evaluate(
        (button) => document.querySelector(button).click(),
        button
      );

      //   Read in text from the whole block
      let article_text = await readText(page, '//*[@id="introduction"]/div[2]');

      //   append the text and details to the description file
      await appendToFile(file, `${country},${city}\n` + article_text + "\n");
    } catch {
      console.log("short paragraph, no extended paragraph");
      try {
        let desc_text = await readText(
          page,
          '//*[@id="introduction"]/div[2]/div'
        );

        await appendToFile(file, `${country},${city}\n` + desc_text + "\n");
      } catch {
        console.log("No text found at all");
      }
    }
  } else {
    // await appendToFile(file, `${country},${city}\n` + "No Description" + "\n");
    console.log("error for: ", country, city);
  }
}
async function scrapeLocationDirect(country, city, baseURL, browser) {
  let url = `${baseURL}/${country}/${city}`;

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  await scrapePage(page, country, city);

  await page.close();
}
async function scrapeLocationGoogle(country, city, browser) {
  let url = `https://google.com/search?q=${country}+${city}+lonely+planet`;
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  let [first_link] = await page.$x('//*[@id="rso"]/div[1]/div/div[1]/a');
  try {
    let first_link_url = await first_link.getProperty("href");
    first_link_url = await first_link_url.jsonValue();
    await page.goto(first_link_url);

    await scrapePage(page, country, city);
    await page.close();
  } catch (error) {
    console.log(error);
  }
}
formURL = (baseURL, country, city) => {
  return `${baseURL}/${country.replace(/\s/g, "-")}/${city.replace(
    /\s/g,
    "-"
  )}`;
};

cycleThroughCities = async (city_list, baseURL) => {
  let counter = 0;

  const browser = await puppeteer.launch();
  const start = 39; //did 18 then it crashed

  for (let counter = start; counter < city_list.length; ) {
    // await scrapeLocationDirect(
    //   city_list[counter].country.replace(/\s/g, "-"),
    //   city_list[counter].city.replace(/\s/g, "-"),
    //   baseURL,
    //   browser
    // )
    await scrapeLocationGoogle(
      city_list[counter].country,
      city_list[counter].city,
      browser
    )
      .then(() => counter++, console.log(counter))
      .catch((error) => {
        console.log(city_list[counter].country, city_list[counter].city);
        console.log(error);
      });
  }
};

const cities_with_no_descriptions = [
  { country: "Ivory-Coast", city: "Abidjan" },
  { country: "Antigua-and-Barbuda", city: "Saint-John’s" },
  { country: "Bermuda", city: "Hamilton" },
  { country: "Gambia", city: "Banjul" },
  { country: "Malawi", city: "Blantyre" },
  { country: "India", city: "Mumbai" },
  { country: "Brunei", city: "Bandar-Seri-Begawan" },
  { country: "Greece", city: "Corfu" },
  { country: "Germany", city: "Cologne" },
  { country: "Romania", city: "Cluj-Napoca" },
  { country: "Colombia", city: "Cali" },
  { country: "China", city: "Chengdu" },
  { country: "Cameroon", city: "Douala" },
  { country: "Dominica", city: "Dominica" },
  { country: "Iraq", city: "Erbil" },
  { country: "United-Kingdom", city: "Edinburgh" },
  { country: "Netherlands", city: "Eindhoven" },
  { country: "United-States", city: "New-York" },
  { country: "Faroe-Islands", city: "Sorvagur" },
  { country: "DR-Congo", city: "Kinshasa" },
  { country: "Guernsey", city: "Guernsey" },
  { country: "Gibraltar", city: "Gibraltar" },
  { country: "Grenada", city: "St.-George" },
  { country: "Greenland", city: "Nuuk" },
  { country: "Sweden", city: "Gothenburg" },
  { country: "Azerbaijan", city: "Baku" },
  { country: "Comoros", city: "Moroni" },
  { country: "Somalia", city: "Hargeisa" },
  { country: "Hong-Kong", city: "Hong-Kong" },
  { country: "Saudi-Arabia", city: "Jeddah" },
  { country: "Djibouti", city: "Djibouti" },
  { country: "South-Africa", city: "Johannesburg" },
  { country: "Pakistan", city: "Karachi" },
  { country: "Indonesia", city: "Medan" },
  { country: "Poland", city: "Krakow" },
  { country: "Kuwait", city: "Kuwait" },
  { country: "Luxembourg", city: "Luxembourg" },
  { country: "Macau", city: "Macau" },
  { country: "Malta", city: "Luqa" },
  { country: "Mauritius", city: "Mauritius" },
  { country: "Kazakhstan", city: "Nur-Sultan" },
  { country: "North-Macedonia", city: "Ohrid" },
  { country: "Cyprus", city: "Paphos" },
  { country: "Turks-and-Caicos-Islands", city: "Providenciales" },
  { country: "Trinidad-and-Tobago", city: "Port-Of-Spain" },
  { country: "French-Polynesia", city: "Papeete" },
  { country: "Czechia", city: "Prague" },
  { country: "Kosovo", city: "Pristina" },
  { country: "Dominican-Republic", city: "Punta-Cana" },
  { country: "Cape-Verde", city: "Praia" },
  { country: "Myanmar", city: "Yangon" },
  { country: "Seychelles", city: "Mahe-Island" },
  { country: "Singapore", city: "Singapore" },
  { country: "Greece", city: "Thessaloniki" },
  { country: "Saint-Lucia", city: "Castries" },
  { country: "Croatia", city: "Split" },
  { country: "Egypt", city: "Sharm-El-Sheikh" },
  { country: "United-Kingdom", city: "London" },
  { country: "Saint-Vincent-and-the-Grenadines", city: "Kingstown" },
  { country: "St-Maarten", city: "Philipsburg" },
  { country: "Israel", city: "Tel-Aviv" },
  { country: "Sao-Tome-and-Principe", city: "Sao-Tome-Is" },
  { country: "Tunisia", city: "Tunis-Carthage" },
  { country: "Bosnia-and-Herzegovina", city: "Tuzla" },
  { country: "Bolivia", city: "Santa-Cruz" },
  { country: "Croatia", city: "Zadar" },
  { country: "Spain", city: "Malaga" },
  { country: "Netherlands", city: "Amsterdam" },
  { country: "India", city: "Bengaluru" },
  { country: "France", city: "Bordeaux" },
  { country: "New-Zealand", city: "Christchurch" },
  { country: "India", city: "New-Delhi" },
  { country: "Portugal", city: "Faro" },
  { country: "Germany", city: "Frankfurt" },
  { country: "Guam", city: "Barrigada" },
  { country: "Egypt", city: "Hurghada" },
  { country: "Greece", city: "Kos" },
  { country: "Cyprus", city: "Larnaca" },
  { country: "Pakistan", city: "Lahore" },
  { country: "Fiji", city: "Nadi" },
  { country: "Croatia", city: "Pula" },
  { country: "Morocco", city: "Marrakech-Menara" },
  { country: "Crimea", city: "Simferopol" },
  { country: "North-Macedonia", city: "Skopje" },
  { country: "Libya", city: "Tripoli" },
  { country: "Central-African-Republic", city: "Bangui" },
  { country: "Republic-of-the-Congo", city: "Brazzaville" },
  { country: "Indonesia", city: "Denpasar" },
  { country: "Mayotte", city: "Dzaoudzi" },
  { country: "Turkey", city: "Ankara" },
  { country: "Mexico", city: "Guadalajara" },
  { country: "Guyana", city: "Georgetown" },
  { country: "Pakistan", city: "Islamabad" },
  { country: "Slovakia", city: "Kosice" },
  { country: "Georgia", city: "Kutaisi" },
  { country: "Ukraine", city: "Lviv" },
  { country: "Chad", city: "N’Djamena" },
  { country: "Portugal", city: "Porto" },
  { country: "Italy", city: "Palermo" },
  { country: "Reunion", city: "Saint-Denis" },
  { country: "Honduras", city: "San-Pedro-Sula" },
  { country: "Saint-Barthelemy", city: "St-Barthelemy" },
  { country: "United-Arab-Emirates", city: "Sharjah" },
  { country: "Finland", city: "Turku" },
  { country: "Morocco", city: "Tangier" },
  { country: "Poland", city: "Nowy-Dwor-Mazowiecki" },
  { country: "Tanzania", city: "Zanzibar" },
  { country: "Turkey", city: "Izmir" },
  { country: "Jordan", city: "Aqaba" },
  { country: "Norway", city: "Bergen" },
  { country: "French-Polynesia", city: "Bora-Bora" },
  { country: "Caribbean-Netherlands", city: "Bonaire" },
  { country: "United-Kingdom", city: "Bristol" },
  { country: "Switzerland", city: "Basel" },
  { country: "French-Guiana", city: "Cayenne" },
  { country: "Chile", city: "Concepcion" },
  { country: "Curacao", city: "Curacao" },
  { country: "DR-Congo", city: "Lubumbashi" },
  { country: "Poland", city: "Gdansk" },
  { country: "Kazakhstan", city: "Atyrau" },
  { country: "Tanzania", city: "Kilimanjaro" },
  { country: "Colombia", city: "Medellin" },
  { country: "Somalia", city: "Mogadishu" },
  { country: "Bahamas", city: "Nassau" },
  { country: "Suriname", city: "Paramaribo" },
  { country: "Bosnia-and-Herzegovina", city: "Sarajevo" },
  { country: "Slovakia", city: "Poprad" },
  { country: "Italy", city: "Verona" },
  { country: "Canada", city: "Calgary" },
  { country: "Bolivia", city: "Cochabamba" },
  { country: "India", city: "Kochi" },
  { country: "Ecuador", city: "Guayaquil" },
  { country: "United-States", city: "Washington" },
  { country: "United-States", city: "Miami" },
  { country: "France", city: "Marseille" },
  { country: "Poland", city: "Wroclaw" },
];
// const city_list = defineUniqueCities();
const city_list = cities_with_no_descriptions;
// cycleThroughCities(city_list, baseURL);
