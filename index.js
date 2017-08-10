var browser = browser || chrome

const youtubeVideosFinder = new YoutubeVideosFinder()
const videosManager = new VideosDisplayManager(youtubeVideosFinder)

browser.runtime.sendMessage({ type: 'get-filters' }, (filters) => videosManager.updateFilters(filters))
browser.runtime.onMessage.addListener((filters) => videosManager.updateFilters(filters))
