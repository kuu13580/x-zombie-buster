console.log("ZonbieBuster Initialized");

const defalstOptions = {
  repeat: false,
  repeatThreshold: 2,
  promotion: false,
  verified: false,
  emoji: false,
  duplicate: false,
};

let options = defalstOptions;

const fetchOptions = async () => {
  chrome.storage.local.get(["options"]).then((result) => {
    if (!result.options) return;
    options = result.options;
  });
}

chrome.storage.onChanged.addListener(() => {
  fetchOptions();
});

const getOptionValue = (key) => {
  return options.hasOwnProperty(key) ? options[key] : defalstOptions[key];
}

let urlBuffer = "";

const main = () => {
  if (urlBuffer != window.location.href) {
    urlBuffer = window.location.href;
    onUrlChange();
  };
  if (getOptionValue("verified")) {
    try {
      deleteVerified()
    } catch { }
  }
  if (getOptionValue("repeat")) {
    try {
      deleteZombie()
    } catch { }
  }
  if (getOptionValue("promotion")) {
    try {
      deletePromotion()
    } catch { }
  }
  if (getOptionValue("emoji")) {
    try {
      deleteEmoji()
    } catch { }
  }
  if (getOptionValue("duplicate")) {
    try {
      deleteDuplicate()
    } catch { }
  }
  deleteZombies();
}

fetchOptions();
setInterval(main, 500);