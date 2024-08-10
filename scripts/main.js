console.log("ZonbieBuster Initialized");
const deletePromotion = () => {
  const articles = document.querySelectorAll("article");
  const filteredElements = Array.from(articles).filter((e) => e.textContent.includes("プロモーション"));
  filteredElements.forEach((e) => e.style.display = "none");
}
const deleteZombie = () => {
  const articles = document.querySelectorAll("article");
  const elements = Array.from(articles).map((e) => e.querySelectorAll("a")[2].innerText)
  const counts = elements.reduce((prev, cur) => {
    prev[cur] = (prev[cur] || 0) + 1;
    return prev;
  }, {})
  const filterdNames = Object.keys(counts).filter((name) => counts[name] > 2)
  const filteredElements = Array.from(articles).filter((e) => filterdNames.some(name => e.textContent.includes(name)));
  filteredElements.forEach((e) => e.parentElement.parentElement.parentElement.style.display = "none");
}
const main = async () => {
  try {
    deletePromotion()
    deleteZombie()
  } catch { }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  main();
}
main();