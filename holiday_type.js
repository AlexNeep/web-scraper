const fs = require("fs");
const readline = require("readline");

function formatDescription(desc) {
  desc = desc.replace(/[.,\/#\'!$%\^&\*;:{}=\-_`~()]/g, " ");
  return desc.split(" ");
}
function calculateType(matching_types) {
  let matching_types_name = Object.keys(matching_types);
  let matching_types_values = Object.values(matching_types);

  let main_type = ["empty", 0];
  let secondary_type = ["empty", 0];
  let exclude_list = [];

  // check for beach override
  const BEACH_THRESHHOLD = 5;
  if (
    matching_types_values[matching_types_name.indexOf("beach")] >
    BEACH_THRESHHOLD
  ) {
    main_type = [
      "beach",
      matching_types_values[matching_types_name.indexOf("beach")] +
        matching_types_values[matching_types_name.indexOf("coast")] +
        matching_types_values[matching_types_name.indexOf("hot")],
    ];
    exclude_list.push("beach", "hot", "coast");
  }
  // Check for ski overirde
  const SkI_THRESHOLD = 0;
  if (
    matching_types_values[matching_types_name.indexOf("ski")] > SkI_THRESHOLD
  ) {
    main_type = [
      "ski",
      matching_types_values[matching_types_name.indexOf("ski")] +
        matching_types_values[matching_types_name.indexOf("snow")] +
        matching_types_values[matching_types_name.indexOf("nature")],
    ];
    exclude_list.push("ski", "snow", "nature");
  }

  for (let index = 0; index < matching_types_name.length; index++) {
    // Not on exclusion list
    if (!exclude_list.includes(matching_types_name[index])) {
      if (matching_types_values[index] > main_type[1]) {
        secondary_type = main_type;

        main_type = [matching_types_name[index], matching_types_values[index]];
      } else if (matching_types_values[index] > secondary_type[1]) {
        secondary_type = [
          matching_types_name[index],
          matching_types_values[index],
        ];
      }
    }
  }
  return { main_type, secondary_type };
}
function classifyType(split_desc, current_city, current_country) {
  const holiday_type_classifiers = [
    { word: "beach", type: "beach", weight: 5 },
    { word: "waters", type: "beach", weight: 5 },
    { word: "water", type: "beach", weight: 5 },
    { word: "seaside", type: "beach", weight: 5 },
    { word: "beaches", type: "beach", weight: 5 },
    { word: "capital", type: "city", weight: 5 },
    { word: "cities", type: "city", weight: 5 },
    { word: "city’s", type: "city", weight: 5 },
    { word: "metropolis", type: "city", weight: 5 },
    { word: "culture", type: "culture", weight: 5 },
    { word: "nightlife", type: "nightlife", weight: 5 },
    { word: "nature", type: "nature", weight: 5 },
    { word: "city", type: "city", weight: 5 },
    { word: "skyscrapers", type: "city", weight: 5 },
    { word: "hiking", type: "nature", weight: 5 },
    { word: "snow", type: "snow", weight: 5 },
    { word: "ocean", type: "coast", weight: 5 },
    { word: "ski", type: "ski", weight: 5 },
    { word: "sea", type: "coast", weight: 5 },
    { word: "capitals", type: "city", weight: 4 },
    { word: "cityscape", type: "city", weight: 4 },
    { word: "skyline", type: "city", weight: 4 },
    { word: "sights", type: "culture", weight: 4 },
    { word: "museums", type: "culture", weight: 4 },
    { word: "traditional", type: "culture", weight: 4 },
    { word: "cultural", type: "culture", weight: 4 },
    { word: "tourist", type: "culture", weight: 4 },
    { word: "food", type: "food", weight: 5 },
    { word: "nightclubs", type: "nightlife", weight: 5 },
    { word: "eateries", type: "food", weight: 4 },
    { word: "chefs", type: "food", weight: 4 },
    { word: "kitchens", type: "food", weight: 4 },
    { word: "country", type: "nature", weight: 4 },
    { word: "galleries", type: "art", weight: 4 },
    { word: "port", type: "coast", weight: 4 },
    { word: "clubs", type: "nightlife", weight: 5 },
    { word: "party", type: "nightlife", weight: 4 },
    { word: "mountains", type: "nature", weight: 4 },
    { word: "mountain", type: "nature", weight: 4 },
    { word: "restaurant", type: "food", weight: 4 },
    { word: "opera", type: "culture", weight: 4 },
    { word: "outdoor", type: "nature", weight: 4 },
    { word: "island", type: "coast", weight: 4 },
    { word: "landscapes", type: "nature", weight: 4 },
    { word: "urban", type: "city", weight: 3 },
    { word: "parks", type: "culture", weight: 3 },
    { word: "architecture", type: "culture", weight: 3 },
    { word: "museum", type: "culture", weight: 3 },
    { word: "cathedrals", type: "culture", weight: 3 },
    { word: "tradition", type: "culture", weight: 3 },
    { word: "medieval", type: "culture", weight: 3 },
    { word: "palaces", type: "culture", weight: 3 },
    { word: "garden", type: "culture", weight: 3 },
    { word: "historic", type: "culture", weight: 3 },
    { word: "churches", type: "culture", weight: 3 },
    { word: "cafes", type: "food", weight: 3 },
    { word: "bars", type: "nightlife", weight: 4 },
    { word: "restaurants", type: "food", weight: 3 },
    { word: "drink", type: "nightlife", weight: 3 },
    { word: "cocktail", type: "nightlife", weight: 5 },
    { word: "gardens", type: "nature", weight: 3 },
    { word: "walking", type: "nature", weight: 3 },
    { word: "wave", type: "coast", weight: 4 },
    { word: "sun", type: "hot", weight: 5 },
    { word: "art", type: "culture", weight: 3 },
    { word: "history", type: "culture", weight: 3 },
    { word: "culinary", type: "food", weight: 3 },
    { word: "colonial", type: "culture", weight: 3 },
    { word: "arts", type: "art", weight: 3 },
    { word: "cuisine", type: "food", weight: 3 },
    { word: "islands", type: "coast", weight: 4 },
    { word: "drinking", type: "nightlife", weight: 4 },
    { word: "artistic", type: "art", weight: 3 },
    { word: "artists", type: "art", weight: 3 },
    { word: "summer", type: "hot", weight: 3 },
    { word: "river", type: "nature", weight: 3 },
    { word: "leafy", type: "nature", weight: 3 },
    { word: "sculpture", type: "culture", weight: 3 },
    { word: "canal", type: "nature", weight: 3 },
    { word: "ancient", type: "culture", weight: 2 },
    { word: "architectural", type: "culture", weight: 2 },
    { word: "heritage", type: "culture", weight: 2 },
    { word: "church", type: "culture", weight: 2 },
    { word: "cooking", type: "food", weight: 2 },
    { word: "coffee", type: "food", weight: 2 },
    { word: "pub", type: "food", weight: 2 },
    { word: "surrounding", type: "nature", weight: 2 },
    { word: "rock", type: "nature", weight: 2 },
    { word: "bustling", type: "nightlife", weight: 2 },
    { word: "scene", type: "nature", weight: 1 },
    { word: "skiing", type: "ski", weight: 5 },
    { word: "clubbers", type: "nightlife", weight: 5 },
  ];

  let matching_types = [];
  holiday_type_classifiers.forEach((classifer) => {
    if (matching_types.indexOf(classifer.type) === -1) {
      matching_types[classifer.type] = 0;
    }
  });

  split_desc.forEach((word) => {
    word = word.toLocaleLowerCase();

    holiday_type_classifiers.forEach((classifer) => {
      if (word === classifer.word) {
        matching_types[classifer.type] += classifer.weight;
      }
    });
  });
  return calculateType(matching_types);
}
function calculateCommonWords(all_words, word_count) {
  const stop_words = [
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "ain",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "can",
    "couldn",
    "couldn't",
    "d",
    "did",
    "didn",
    "didn't",
    "do",
    "does",
    "doesn",
    "doesn't",
    "doing",
    "don",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn",
    "hadn't",
    "has",
    "hasn",
    "hasn't",
    "have",
    "haven",
    "haven't",
    "having",
    "he",
    "her",
    "here",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "i",
    "if",
    "in",
    "into",
    "is",
    "isn",
    "isn't",
    "it",
    "it's",
    "its",
    "itself",
    "just",
    "ll",
    "m",
    "ma",
    "me",
    "mightn",
    "mightn't",
    "more",
    "most",
    "mustn",
    "mustn't",
    "my",
    "myself",
    "needn",
    "needn't",
    "no",
    "nor",
    "not",
    "now",
    "o",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "re",
    "s",
    "same",
    "shan",
    "shan't",
    "she",
    "she's",
    "should",
    "should've",
    "shouldn",
    "shouldn't",
    "so",
    "some",
    "such",
    "t",
    "than",
    "that",
    "that'll",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "ve",
    "very",
    "was",
    "wasn",
    "wasn't",
    "we",
    "were",
    "weren",
    "weren't",
    "what",
    "when",
    "where",
    "which",
    "while",
    "who",
    "whom",
    "why",
    "will",
    "with",
    "won",
    "won't",
    "wouldn",
    "wouldn't",
    "y",
    "you",
    "you'd",
    "you'll",
    "you're",
    "you've",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "could",
    "he'd",
    "he'll",
    "he's",
    "here's",
    "how's",
    "i'd",
    "i'll",
    "i'm",
    "i've",
    "let's",
    "ought",
    "she'd",
    "she'll",
    "that's",
    "there's",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "we'd",
    "we'll",
    "we're",
    "we've",
    "what's",
    "when's",
    "where's",
    "who's",
    "why's",
    "would",
    "able",
    "abst",
    "accordance",
    "according",
    "accordingly",
    "across",
    "act",
    "actually",
    "added",
    "adj",
    "affected",
    "affecting",
    "affects",
    "afterwards",
    "ah",
    "almost",
    "alone",
    "along",
    "already",
    "also",
    "although",
    "always",
    "among",
    "amongst",
    "announce",
    "another",
    "anybody",
    "anyhow",
    "anymore",
    "anyone",
    "anything",
    "anyway",
    "anyways",
    "anywhere",
    "apparently",
    "approximately",
    "arent",
    "arise",
    "around",
    "aside",
    "ask",
    "asking",
    "auth",
    "available",
    "away",
    "awfully",
    "b",
    "back",
    "became",
    "become",
    "becomes",
    "becoming",
    "beforehand",
    "begin",
    "beginning",
    "beginnings",
    "begins",
    "behind",
    "believe",
    "beside",
    "besides",
    "beyond",
    "biol",
    "brief",
    "briefly",
    "c",
    "ca",
    "came",
    "cannot",
    "can't",
    "cause",
    "causes",
    "certain",
    "certainly",
    "co",
    "com",
    "come",
    "comes",
    "contain",
    "containing",
    "contains",
    "couldnt",
    "date",
    "different",
    "done",
    "downwards",
    "due",
    "e",
    "ed",
    "edu",
    "effect",
    "eg",
    "eight",
    "eighty",
    "either",
    "else",
    "elsewhere",
    "end",
    "ending",
    "enough",
    "especially",
    "et",
    "etc",
    "even",
    "ever",
    "every",
    "everybody",
    "everyone",
    "everything",
    "everywhere",
    "ex",
    "except",
    "f",
    "far",
    "ff",
    "fifth",
    "first",
    "five",
    "fix",
    "followed",
    "following",
    "follows",
    "former",
    "formerly",
    "forth",
    "found",
    "four",
    "furthermore",
    "g",
    "gave",
    "get",
    "gets",
    "getting",
    "give",
    "given",
    "gives",
    "giving",
    "go",
    "goes",
    "gone",
    "got",
    "gotten",
    "h",
    "happens",
    "hardly",
    "hed",
    "hence",
    "hereafter",
    "hereby",
    "herein",
    "heres",
    "hereupon",
    "hes",
    "hi",
    "hid",
    "hither",
    "home",
    "howbeit",
    "however",
    "hundred",
    "id",
    "ie",
    "im",
    "immediate",
    "immediately",
    "importance",
    "important",
    "inc",
    "indeed",
    "index",
    "information",
    "instead",
    "invention",
    "inward",
    "itd",
    "it'll",
    "j",
    "k",
    "keep",
    "keeps",
    "kept",
    "kg",
    "km",
    "know",
    "known",
    "knows",
    "l",
    "largely",
    "last",
    "lately",
    "later",
    "latter",
    "latterly",
    "least",
    "less",
    "lest",
    "let",
    "lets",
    "like",
    "liked",
    "likely",
    "line",
    "little",
    "'ll",
    "look",
    "looking",
    "looks",
    "ltd",
    "made",
    "mainly",
    "make",
    "makes",
    "many",
    "may",
    "maybe",
    "mean",
    "means",
    "meantime",
    "meanwhile",
    "merely",
    "mg",
    "might",
    "million",
    "miss",
    "ml",
    "moreover",
    "mostly",
    "mr",
    "mrs",
    "much",
    "mug",
    "must",
    "n",
    "na",
    "name",
    "namely",
    "nay",
    "nd",
    "near",
    "nearly",
    "necessarily",
    "necessary",
    "need",
    "needs",
    "neither",
    "never",
    "nevertheless",
    "new",
    "next",
    "nine",
    "ninety",
    "nobody",
    "non",
    "none",
    "nonetheless",
    "noone",
    "normally",
    "nos",
    "noted",
    "nothing",
    "nowhere",
    "obtain",
    "obtained",
    "obviously",
    "often",
    "oh",
    "ok",
    "okay",
    "old",
    "omitted",
    "one",
    "ones",
    "onto",
    "ord",
    "others",
    "otherwise",
    "outside",
    "overall",
    "owing",
    "p",
    "page",
    "pages",
    "part",
    "particular",
    "particularly",
    "past",
    "per",
    "perhaps",
    "placed",
    "please",
    "plus",
    "poorly",
    "possible",
    "possibly",
    "potentially",
    "pp",
    "predominantly",
    "present",
    "previously",
    "primarily",
    "probably",
    "promptly",
    "proud",
    "provides",
    "put",
    "q",
    "que",
    "quickly",
    "quite",
    "qv",
    "r",
    "ran",
    "rather",
    "rd",
    "readily",
    "really",
    "recent",
    "recently",
    "ref",
    "refs",
    "regarding",
    "regardless",
    "regards",
    "related",
    "relatively",
    "research",
    "respectively",
    "resulted",
    "resulting",
    "results",
    "right",
    "run",
    "said",
    "saw",
    "say",
    "saying",
    "says",
    "sec",
    "section",
    "see",
    "seeing",
    "seem",
    "seemed",
    "seeming",
    "seems",
    "seen",
    "self",
    "selves",
    "sent",
    "seven",
    "several",
    "shall",
    "shed",
    "shes",
    "show",
    "showed",
    "shown",
    "showns",
    "shows",
    "significant",
    "significantly",
    "similar",
    "similarly",
    "since",
    "six",
    "slightly",
    "somebody",
    "somehow",
    "someone",
    "somethan",
    "something",
    "sometime",
    "sometimes",
    "somewhat",
    "somewhere",
    "soon",
    "sorry",
    "specifically",
    "specified",
    "specify",
    "specifying",
    "still",
    "stop",
    "strongly",
    "sub",
    "substantially",
    "successfully",
    "sufficiently",
    "suggest",
    "sup",
    "sure",
    "take",
    "taken",
    "taking",
    "tell",
    "tends",
    "th",
    "thank",
    "thanks",
    "thanx",
    "thats",
    "that've",
    "thence",
    "thereafter",
    "thereby",
    "thered",
    "therefore",
    "therein",
    "there'll",
    "thereof",
    "therere",
    "theres",
    "thereto",
    "thereupon",
    "there've",
    "theyd",
    "theyre",
    "think",
    "thou",
    "though",
    "thoughh",
    "thousand",
    "throug",
    "throughout",
    "thru",
    "thus",
    "til",
    "tip",
    "together",
    "took",
    "toward",
    "towards",
    "tried",
    "tries",
    "truly",
    "try",
    "trying",
    "ts",
    "twice",
    "two",
    "u",
    "un",
    "unfortunately",
    "unless",
    "unlike",
    "unlikely",
    "unto",
    "upon",
    "ups",
    "us",
    "use",
    "used",
    "useful",
    "usefully",
    "usefulness",
    "uses",
    "using",
    "usually",
    "v",
    "value",
    "various",
    "'ve",
    "via",
    "viz",
    "vol",
    "vols",
    "vs",
    "w",
    "want",
    "wants",
    "wasnt",
    "way",
    "wed",
    "welcome",
    "went",
    "werent",
    "whatever",
    "what'll",
    "whats",
    "whence",
    "whenever",
    "whereafter",
    "whereas",
    "whereby",
    "wherein",
    "wheres",
    "whereupon",
    "wherever",
    "whether",
    "whim",
    "whither",
    "whod",
    "whoever",
    "whole",
    "who'll",
    "whomever",
    "whos",
    "whose",
    "widely",
    "willing",
    "wish",
    "within",
    "without",
    "wont",
    "words",
    "world",
    "wouldnt",
    "www",
    "x",
    "yes",
    "yet",
    "youd",
    "youre",
    "z",
    "zero",
    "a's",
    "ain't",
    "allow",
    "allows",
    "apart",
    "appear",
    "appreciate",
    "appropriate",
    "associated",
    "best",
    "better",
    "c'mon",
    "c's",
    "cant",
    "changes",
    "clearly",
    "concerning",
    "consequently",
    "consider",
    "considering",
    "corresponding",
    "course",
    "currently",
    "definitely",
    "described",
    "despite",
    "entirely",
    "exactly",
    "example",
    "going",
    "greetings",
    "hello",
    "help",
    "hopefully",
    "ignored",
    "inasmuch",
    "indicate",
    "indicated",
    "indicates",
    "inner",
    "insofar",
    "it'd",
    "keep",
    "keeps",
    "novel",
    "presumably",
    "reasonably",
    "second",
    "secondly",
    "sensible",
    "serious",
    "seriously",
    "sure",
    "t's",
    "third",
    "thorough",
    "thoroughly",
    "three",
    "well",
    "wonder",
  ];
  let count = 0;
  const REQUIRE_FREQUENCY = 4;
  for (let index = 0; index < all_words.length; index++) {
    if (word_count[index] > REQUIRE_FREQUENCY) {
      if (!stop_words.includes(all_words[index])) {
        // Copy and Paste from Console
        console.log(`${word_count[index]}`);
        console.log(`${all_words[index]}`);
        count++;
      }
    }
  }
  console.log("Potential Classifing Words:" + count);
}
function addNewWord(split_desc, all_words, word_count) {
  split_desc.forEach((word) => {
    let index = all_words.indexOf(word.toLowerCase());
    if (index === -1) {
      all_words.push(word);
      word_count.push(1);
    } else {
      word_count[index] = word_count[index] + 1;
    }
  });
  return [all_words, word_count];
}
async function getTypes(file) {
  const fileStream = fs.createReadStream(file);
  let cities = [];
  let current_city = "";
  let current_country = "";
  let current_desc = "";
  let current_types = [];
  let desc_line = false;

  let word_count = [];
  let all_words = [];

  let success_count = 0;
  let failed_count = 0;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if (!desc_line) {
      let temp = line.split(",");
      current_country = temp[0];
      current_city = temp[1];
    } else {
      current_desc = line;
      if (line === "No Description") {
        // classifyType();
        failed_count++;
      } else {
        let split_desc = formatDescription(current_desc);

        let { main_type, secondary_type } = classifyType(
          split_desc,
          current_city,
          current_country
        );
        success_count++;
        console.log(
          `{"city":"${current_city}",'country':"${current_country}","main_type": "${main_type[0]}","secondary_type": "${secondary_type[0]}"},`
        );
      }
    }
    desc_line = !desc_line;
  }
  // console.log(`Countries with Descriptions: ${success_count}\nCountries without Descriptions : ${failed_count}`);
}

getTypes("descriptions_all_extended.txt");
// getTypes("test.txt");

async function getWords(file) {
  const fileStream = fs.createReadStream(file);
  let cities = [];
  let current_city = "";
  let current_country = "";
  let current_desc = "";
  let current_types = [];
  let desc_line = false;

  let word_count = [];
  let all_words = [];

  let success_count = 0;
  let failed_count = 0;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if (!desc_line) {
      let temp = line.split(",");
      current_country = temp[0];
      current_city = temp[1];
    } else {
      current_desc = line;
      if (line === "No Description") {
        failed_count++;
      } else {
        current_desc = current_desc.replace(
          /[.,\/#\'!$%\^&\*;:{}=\-_`~()]/g,
          " "
        );
        let split_desc = current_desc.split(" ");

        let temp = addNewWord(split_desc, all_words, word_count);
        all_words = temp[0];
        word_count = temp[1];

        success_count++;
      }
    }
    desc_line = !desc_line;
  }
  // console.log(`Countries with Descriptions: ${success_count}\nCountries without Descriptions : ${failed_count}`);
  // calculateCommonWords(all_words, word_count);
}

// Used to find which citites did not work directely. Used Indirect Google Crawl to find these..
async function getNoDescriptionCities(file) {
  const fileStream = fs.createReadStream(file);
  let desc_line = false;

  let current_country = "";
  let current_city = "";

  let success_count = 0;
  let failed_count = 0;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    if (!desc_line) {
      let temp = line.split(",");
      current_country = temp[0];
      current_city = temp[1];
    } else {
      current_desc = line;
      if (line === "No Description") {
        // classifyType();
        console.log(
          `{"country":"${current_country}","city":"${current_city}"},`
        );
        failed_count++;
      } else {
        success_count++;
      }
    }
    desc_line = !desc_line;
  }
  console.log(
    `Countries with Descriptions: ${success_count}\nCountries without Descriptions : ${failed_count}`
  );
}
// getNoDescriptionCities("descriptions_all.txt");
