let zombieUsers = new Set();

const deleteArticles = (targetArticles) => {
  let i = 0;
  Array.from(targetArticles).forEach((article) => {
    if (article.parentElement.parentElement.style.display == "none") return;
    if (i++ > 10) return;
    article.parentElement.parentElement.style.display = "none";
  });
}

const deleteZombies = () => {
  const articles = document.querySelectorAll("article");
  const filteredArticles = Array.from(articles).filter((e) => Array.from(zombieUsers).some(name => e.querySelectorAll("a").length > 3 && e.querySelectorAll("a")[2].innerText == name) && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`);
  console.log(filteredArticles);
  deleteArticles(filteredArticles);
}
const getOwnerName = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  return window.location.href.split("/")[3];
}

const onUrlChange = () => {
  zombieUsers = new Set();
}

const deletePromotion = () => {
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter((e) => e.textContent.includes("プロモーション"));
  deleteArticles(filteredElements);
}

const deleteZombie = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const elements = Array.from(articles).map((e) => e.querySelectorAll("a").length > 3 ? e.querySelectorAll("a")[2].innerText : undefined).filter((e) => e);
  const counts = elements.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {})
  try {
    delete counts[getOwnerName()];
  } catch { }
  Object.keys(counts).filter((name) => counts[name] > getOptionValue("repeatThreshold")).forEach((name) => zombieUsers.add(name));
}

const deleteVerified = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  Array.from(articles).filter((e) => e.querySelectorAll("svg[data-test-id='icon-verified']") && e.querySelectorAll("a").length > 3 && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`).forEach((e) => zombieUsers.add(e.querySelectorAll("a")[2].innerText));
}

const deleteEmoji = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const regEmoji = new RegExp(/^(<img(.*)>)+$/, 'g');
  Array.from(articles).filter((e) => e.querySelector("div[data-testid='tweetText']").innerHTML.match(regEmoji)).forEach((e) => zombieUsers.add(e.querySelectorAll("a")[2].innerText));
}
