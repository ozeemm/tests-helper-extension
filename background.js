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

    const answersMax = 3
    const outputs = []
    let answersCount = 0

    const jsonUrl = chrome.runtime.getURL("data.json")
    
    fetch(jsonUrl).then(r => r.json()).then(json => {
        for(var key of Object.keys(json)){
            if(key.toLowerCase().includes(selectedText.toLowerCase())){
                outputs.push({ question: key, answer: json[key]})
                answersCount++
                if(answersCount == answersMax)
                  break
            }
        }

        if(answersCount > 0){
            let msg = ""
            outputs.forEach((out, i) => {
              msg += `${i+1}. Вопрос: ${out.question}\n`
              msg += `- Ответ: ${out.answer}\n`

            })
            alert(msg)
        }
        else
            alert("Not found!")
   })  
}