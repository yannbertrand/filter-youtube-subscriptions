var browser = browser || chrome

let filters = []

browser.runtime.onMessage.addListener(handleMessage)

function handleMessage(request, sender, sendResponse) {
  if (request.type === 'get-filters') {
    updateFilters(sendResponse)
  } else if (request.type === 'set-filters') {
    filters = request.filters
    browser.storage.sync.set({ filters })
    refreshPageFilters()
  }

  return true
}

function updateFilters(callback) {
  browser.storage.sync.get('filters', (response) => {
    if (typeof response.filters === 'undefined') {
      browser.storage.sync.set({ filters })
      return callback(filters)
    }

    filters = response.filters
    return callback(filters)
  })
}

function refreshPageFilters() {
  browser.tabs.query({ url: 'https://www.youtube.com/feed/subscriptions' }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, filters)
    })
  })
}
