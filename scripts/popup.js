const defaultOptions = {
  repeat: false,
}

const setStorage = (key, value) => {
  chrome.storage.local.get(["options"]).then((result) => {
    const options = result.options || defaultOptions;
    options[key] = value;
    chrome.storage.local.set({ options });
  }
  );
}

const initializeOptions = () => {
  chrome.storage.local.get(["options"]).then((result) => {
    const options = result.options || defaultOptions;
    document.getElementById("repeat").checked = options.repeat;
  });
}

document.getElementById("repeat").addEventListener("change", (e) => setStorage("repeat", e.target.checked));
document.addEventListener("DOMContentLoaded", initializeOptions);