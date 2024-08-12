const deleteArticle = (targetArticles) => {
  targetArticles.forEach((article) => {
    article.parentElement.innerText = "ZombieBuster: このツイートは非表示に変更されました";
    article.parentElement.style.fontSize = "8px";
  });
}

const getOwnerName = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  return window.location.href.split("/")[3];
}

const deletePromotion = () => {
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter((e) => e.textContent.includes("プロモーション"));
  deleteArticle(filteredElements);
}

const deleteZombie = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  Array.from(articles).forEach((e) => console.log(e.querySelectorAll("a").length));
  const elements = Array.from(articles).map((e) => e.querySelectorAll("a")[2].innerText || "oops!")
  const counts = elements.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {})
  try {
    delete counts[getOwnerName()];
  } catch { }
  const filterdNames = Object.keys(counts).filter((name) => counts[name] > getOptionValue("repeatThreshold"));
  const filteredElements = Array.from(articles).filter((e) => filterdNames.some(name => e.textContent.includes(name) && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`));
  deleteArticle(filteredElements);
}

const deleteVerified = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter((e) => e.querySelectorAll("svg[data-test-id='icon-verified']") && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`);
  deleteArticle(filteredElements);
}
