var browser = browser || chrome

const youtubeVideosFinder = new YoutubeVideosFinder()
const videosManager = new VideosDisplayManager(browser, youtubeVideosFinder)
