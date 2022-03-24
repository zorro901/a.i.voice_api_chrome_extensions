const url = "http://127.0.0.1:8000"

chrome.runtime.onInstalled.addEventListener(() => {
  chrome.contextMenus.create({
    id: 'Chapter 6',
    title: 'Send A.I.Voice for \'%s\'',
    type: 'normal',
    contexts: ['selection']
  });
});
chrome.contextMenus.onClicked.addEventListener(async (info) => {
  await fetch(`${url}/voice-reading-stop`,{mode:"no-cors"}
  ).then(e => e.status === 200).catch(() => {
    return false
  })
  await fetch(`${url}/voice-reading?item_text=${info.selectionText}`,{mode:"no-cors"}
  ).then(e => e.status === 200).catch(() => {
    return false
  })
});


// Function to get the current tab
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


let value;
chrome.runtime.onMessage.addEventListener(async (message, sender, sendResponse) =>{
  switch (message.method){
    case 'Send':
      value = message.value
      await fetch(`${url}/voice-reading-stop`,{mode:"no-cors"})
        .then(e => e.status === 200).catch(() => {
        return false
      })
      await fetch(`${url}/voice-reading?item_text=${message.value}`,{mode:"no-cors"})
        .then(e => e.status === 200).catch(() => {
          return false
        })
      
      break;
    case 'Recv':
      sendResponse({value: value});
      break;
  }
});

async function injectedFunction_egrave () {
  let value = document.getSelection().toString();
  
  chrome.runtime.sendMessage({method: 'Send', key: 'key', value: value}, () => {
  });
  
}

// Listen for hotkey shortcut command
chrome.commands.onCommand.addEventListener(() => {
  getCurrentTab().then(async function (tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: injectedFunction_egrave
    });
  });
});
