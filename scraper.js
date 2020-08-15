const puppeteer = require("puppeteer");

require("./city_list");
const fsLibrary = require("fs");

const baseURL = "https://www.lonelyplanet.com";
const transport_end_url = "transportation";

const file = "descriptions_all.txt";

appendToFile = (file, data) => {
  fsLibrary.appendFile(file, data, (error) => {
    if (error) {
      console.log(error);
      throw error;
    }
  });
};
async function scrapeLocation(country, city, baseURL, browser) {
  let url = `${baseURL}/${country}/${city}`;

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

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
      let [article_block] = await page.$x('//*[@id="introduction"]/div[2]');
      let article_text = await article_block.getProperty("textContent");
      article_text = await article_text.jsonValue();

      //   append the text and details to the description file
      await appendToFile(file, `${country},${city}\n` + article_text + "\n");
    } catch {
      console.log("no button");
      try {
        let [desc] = await page.$x('//*[@id="introduction"]/div[2]/div');
        let desc_text = await desc.getProperty("textContent");
        desc_text = await desc_text.jsonValue();
        await appendToFile(file, `${country},${city}\n` + desc_text + "\n");
      } catch {
        console.log("no paragraph");
      }
    }
  } else {
    await appendToFile(file, `${country},${city}\n` + "No Description" + "\n");
    console.log("error for: ", country, city);
  }
  await page.close();
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

  for (let counter = 0; counter < city_list.length; ) {
    await scrapeLocation(
      city_list[counter].country.replace(/\s/g, "-"),
      city_list[counter].city.replace(/\s/g, "-"),
      baseURL,
      browser
    )
      .then(() => counter++)
      .catch((error) => {
        console.log(city_list[counter].country, city_list[counter].city);
        console.log(error);
      });
  }
};

async function completedCities() {
  const fs = require("fs");
  const readline = require("readline");
  let completed_cities = [];
  let desc_line = false; //first line is country and city combo

  const fileStream = fs.createReadStream(file);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if (!desc_line) {
      let temp = line.split(",");
      completed_cities.push(temp[1]);
    }
    desc_line = !desc_line;
  }
  return completed_cities;
}

// completedCities(file).then((completed_cities) =>
//   city_list.forEach((location) => {
//     if (!completed_cities.includes(location.city.replace(/\s/g, "-"))) {
//       console.log(location.city);
//     }
//   })
// );
const city_list = defineUniqueCities();
cycleThroughCities(city_list, baseURL);
