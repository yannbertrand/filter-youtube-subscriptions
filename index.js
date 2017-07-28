var browser = browser || chrome

let filters = []

browser.runtime.sendMessage('get-filters', getFilters)
browser.runtime.onMessage.addListener(getFilters)

function getFilters(upToDateFilters) {
  filters = upToDateFilters
  hideVideos()
}

function hideVideos() {
  console.log(filters)
}
