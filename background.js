var browser = browser || chrome

let filters = []

browser.runtime.onMessage.addListener(getFilters)

function getFilters(request, sender, sendResponse) {
  updateFilters(sendResponse)

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
