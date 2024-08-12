const defaultOptions = {
  repeat: false,
  repeatThreshold: 2,
  promotion: false,
  verified: false,
  emoji: false
};

const setStorage = (key, value) => {
  chrome.storage.local.get(["options"]).then((result) => {
    const options = { ...defaultOptions, ...result.options };
    options[key] = value;
    chrome.storage.local.set({ options });
  }
  );
}

const initializeOptions = () => {
  chrome.storage.local.get(["options"]).then((result) => {
    const options = { ...defaultOptions, ...result.options };
    document.getElementById("repeat").checked = options.repeat;
    document.getElementById("repeat-threshold").value = Number(options.repeatThreshold);
    document.getElementById("promotion").checked = options.promotion;
    document.getElementById("verified").checked = options.verified;
    document.getElementById("emoji").checked = options.emoji;
  });
}

document.getElementById("repeat").addEventListener("change", (e) => setStorage("repeat", e.target.checked));
document.getElementById("repeat-threshold").addEventListener("change", (e) => setStorage("repeatThreshold", e.target.value));
document.getElementById("promotion").addEventListener("change", (e) => setStorage("promotion", e.target.checked));
document.getElementById("verified").addEventListener("change", (e) => setStorage("verified", e.target.checked));
document.getElementById("emoji").addEventListener("change", (e) => setStorage("emoji", e.target.checked));
document.addEventListener("DOMContentLoaded", initializeOptions);