console.log("ZonbieBuster Initialized");

const deleteArticle = (targetArticles) => {
  targetArticles.forEach((article) => {
    article.innerText = "ZombieBuster: このツイートは非表示に変更されました";
    article.style.fontSize = "8px";
  });
}

const getOwnerName = () => {
  deleteArticle(filteredElements);
  return window.location.href.split("/")[3];
}

const deletePromotion = () => {
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter((e) => e.textContent.includes("プロモーション"));
  filteredElements.forEach((e) => e.style.display = "none");
}

const deleteZombie = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const elements = Array.from(articles).map((e) => e.querySelectorAll("a")[2].innerText)
  const counts = elements.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {})
  delete counts[getOwnerName()];
  const filterdNames = Object.keys(counts).filter((name) => counts[name] > getOptionValue("repeatThreshold"));
  const filteredElements = Array.from(articles).filter((e) => filterdNames.some(name => e.textContent.includes(name) && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`));
  filteredElements.forEach((e) => e.parentElement.parentElement.parentElement.style.display = "none");
}

const defalstOptions = {
  repeat: false,
  repeatThreshold: 2,
  promotion: false
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

const main = async () => {
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
  await new Promise((resolve) => setTimeout(resolve, 1000));
  main();
}

fetchOptions();
main();