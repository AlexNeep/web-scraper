const puppeteer = require("puppeteer");

require("./city_list");
require("./functions");
const fsLibrary = require("fs");
const { count } = require("console");

const baseURL = "https://www.lonelyplanet.com";
const transport_end_url = "transportation";
const city_list = defineCityTypes();

async function scrapeLocation(country, city, baseURL) {
  let url = `${baseURL}/${country}/${city}`;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.goto(url);

  const [error_page] = await page.$x('//*[@id="__next"]/div/div/h1');
  if (!error_page) {
    console.log("success for: ", country, city);

    let first_text = "";
    let second_text = "";

    let first_rawText = "";
    let second_rawText = "";

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
      fsLibrary.appendFile(
        "descriptions.txt",
        `${country},${city}\n` + article_text + "\n",
        (error) => {
          if (error) {
            console.log(error, country, city);
            throw err;
          }
        }
      );
    } catch {
      console.log("no button");
      try {
        let [desc] = await page.$x('//*[@id="introduction"]/div[2]/div');
        let desc_text = await desc.getProperty("textContent");
        desc_text = await desc_text.jsonValue();
        fsLibrary.appendFile(
          "descriptions.txt",
          `${country},${city}\n` + desc_text + "\n",
          (error) => {
            if (error) {
              console.log(error, country, city);
              throw err;
            }
          }
        );
      } catch {
        console.log("no paragraph");
      }
    }
  } else {
    console.log("error for: ", country, city);
  }
  browser.close();
}
formURL = (baseURL, country, city) => {
  return `${baseURL}/${country.replace(/\s/g, "-")}/${city.replace(
    /\s/g,
    "-"
  )}`;
};

cycleThroughCities = async (city_list, baseURL) => {
  let counter = 0;

  await city_list.forEach((location) => {
    counter++;
    // if (counter < 11) {
    // console.log(formURL(baseURL, location.country, location.city));
    scrapeLocation(
      location.country.replace(/\s/g, "-"),
      location.city.replace(/\s/g, "-"),
      baseURL
    ).catch((error) => {
      console.log(location.country, location.city);
      console.log(error);
    });
    // }
  });
};

cycleThroughCities(city_list, baseURL);
// scrapeLocation("spain", "madrid", baseURL);
// //////////////////////// PLAN

// url https://www.lonelyplanet.com/italy/rome/transportation
// location of airport //*[@id="main"]/div/div[1]/div/div[1]/div[22]/article/div/div/div/div/p/span
// //*[@id="main"]/div/div[1]/div/div[1]/div[22]/article

/*

seach each of these divs  : //*[@id="main"]/div/div[1]/div/div[1]/div[22]
until this div equalt 'airport in ${city}' // location of airport //*[@id="main"]/div/div[1]/div/div[1]/div[22]/article/div/div/div/div/p/span
*/

// let locations = new locations();

// ////////////////////////// cycle through countries

// const city_list = defineCityTypes();
// let counter = 0;
// city_list.forEach((location) => {
//   counter++;
//   //   console.log(
//   //     `${baseURL}/${location.country.replace(/\s/g, "-")}/${location.city.replace(
//   //       /\s/g,
//   //       "-"
//   //     )}/transportation`
//   //   );
//   fsLibrary.appendFile(
//     "cities.txt",
//     `${baseURL}/${location.country.replace(/\s/g, "-")}/${location.city.replace(
//       /\s/g,
//       "-"
//     )}/transportation` + "\n",
//     (error) => {
//       if (error) throw err;
//     }
//   );
// });
