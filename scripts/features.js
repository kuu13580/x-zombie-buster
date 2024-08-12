let zombieUsers = new Set();
// {"content": {timestamp: Date, user: string}}
let tweets = {};

const deleteArticles = targetArticles => {
  let i = 0;
  Array.from(targetArticles).forEach(article => {
    if (article.parentElement.parentElement.style.display == "none") return;
    if (i++ > 10) return;
    article.parentElement.parentElement.style.display = "none";
  });
};

const deleteZombies = () => {
  const articles = document.querySelectorAll("article");
  const filteredArticles = Array.from(articles).filter(
    e =>
      Array.from(zombieUsers).some(
        name => e.querySelectorAll("a").length > 3 && e.querySelectorAll("a")[2].innerText == name
      ) && e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`
  );
  deleteArticles(filteredArticles);
};

const getOwnerName = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  return window.location.href.split("/")[3];
};

const onUrlChange = () => {
  zombieUsers = new Set();
  tweets = {};
};

const deletePromotion = () => {
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter(e =>
    e.textContent.includes("プロモーション")
  );
  deleteArticles(filteredElements);
};

// これ以下の機能は、ゾンビを特定しリストに追加するもの
// 削除自体はmainで一回のみ行う

const deleteRepeat = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const elements = Array.from(articles)
    .map(e =>
      e.querySelectorAll("a").length > 3 ? e.querySelectorAll("a")[2].innerText : undefined
    )
    .filter(e => e);
  const counts = elements.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {});
  try {
    delete counts[getOwnerName()];
  } catch {}
  Object.keys(counts)
    .filter(name => counts[name] > getOptionValue("repeatThreshold"))
    .forEach(name => zombieUsers.add(name));
};

const deleteVerified = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");

  Array.from(articles)
    .filter(
      e =>
        e.querySelectorAll("svg[data-test-id='icon-verified']") &&
        e.querySelectorAll("a").length > 3 &&
        e.querySelectorAll("a")[2].innerText != `@${getOwnerName()}`
    )
    .forEach(e => zombieUsers.add(e.querySelectorAll("a")[2].innerText));
};

const deleteEmoji = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const regEmoji = new RegExp(/^(<img(.*)>)+$/, "g");
  Array.from(articles)
    .filter(e => e.querySelector("div[data-testid='tweetText']").innerHTML.match(regEmoji))
    .forEach(e => zombieUsers.add(e.querySelectorAll("a")[2].innerText));
};

const deleteDuplicate = () => {
  if (window.location.href.startsWith("https://x.com/home")) return;
  const articles = document.querySelectorAll("article");
  const contents = Array.from(articles)
    .map(e => ({
      content: e.querySelector("div[data-testid='tweetText']")?.innerHTML,
      timestamp: new Date(e.querySelector("time")?.getAttribute("datetime")),
      user: e.querySelectorAll("a")?.length > 3 ? e.querySelectorAll("a")[2].innerText : undefined,
    }))
    .filter(e => e.content && e.timestamp && e.user);
  contents.forEach(e => {
    if (!(e.content in tweets)) {
      tweets[e.content] = {
        timestamp: e.timestamp,
        user: e.user,
      };
      return;
    }
    if (e.timestamp > tweets[e.content].timestamp) {
      // 既存のツイートより新しいツイートがあれば、ユーザーをゾンビリストに追加
      zombieUsers.add(e.user);
    } else if (e.timestamp < tweets[e.content].timestamp) {
      // 古いツイートがあればリストを更新して既存をゾンビリストに追加
      zombieUsers.add(tweets[e.content].user);
      tweets[e.content] = {
        timestamp: e.timestamp,
        user: e.user,
      };
    }
  });
  return;
};
