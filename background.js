chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "selectText",
      title: "Make magic!",
      contexts: ["selection"]
    });
  });
  
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "selectText") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getSelectedText
      });
    }
});
  
function getSelectedText() {
    const selectedText = window.getSelection().toString();
    if (!selectedText)
        return

    const jsonUrl = chrome.runtime.getURL("data.json")
    
    fetch(jsonUrl).then(r => r.json()).then(json => {
        let answer = null
        for(var key of Object.keys(json)){
            if(key.toLowerCase().includes(selectedText.toLowerCase())){
                answer = json[key]
                break
            }
        }

        if(answer)
            alert(answer)
        else
            alert("Not found!")
   })  
}