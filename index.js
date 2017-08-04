var browser = browser || chrome

class VideosDisplayManager {

  constructor(browser) {
    this.filters          = []
    this.upperCaseFilters = []

    browser.runtime.sendMessage({ type: 'get-filters' }, (filters) => this.updateFilters(filters))
    browser.runtime.onMessage.addListener((filters) => this.updateFilters(filters))
  }

  updateFilters(upToDateFilters) {
    this.filters = upToDateFilters
    this.manageVideosDisplay()
  }

  manageVideosDisplay() {
    const { videosToHide, videosToDisplay } = this.getVideosToHideAndDisplay()

    this.hideVideos(videosToHide)
    this.displayVideos(videosToDisplay)
  }

  hideVideos(videos) {
    console.groupCollapsed(`Hiding ${videos.length} videos`)

    for (const video of videos) {
      console.info(video.title)
      video.hide()
    }

    console.groupEnd()
  }

  displayVideos(videos) {
    console.groupCollapsed(`Displaying ${videos.length} videos`)

    for (const video of videos) {
      console.info(video.title)
      video.display()
    }

    console.groupEnd()
  }

  getVideosToHideAndDisplay() {
    const videos          = new YoutubeVideosFinder().find()
    const videosToHide    = []
    const videosToDisplay = []

    for (const video of videos) {
      if (this.thereIsFilters() && this.titleMatchFilters(video.title)) {
        if (video.isDisplayed()) {
          videosToHide.push(video)
        }
      } else {
        if (video.isHidden()) {
          videosToDisplay.push(video)
        }
      }
    }

    return { videosToHide, videosToDisplay }
  }

  thereIsFilters() {
    return this.filters.length > 0
  }

  titleMatchFilters(title) {
    const isTitleFinderRegexUndefined = typeof this.titleFinderRegex === undefined
    const upperCaseFilters            = this.filters.map(title => title.toUpperCase())
    const upperCaseFiltersHaveChanged = ! areArraysEqual(this.upperCaseFilters, upperCaseFilters)

    // Optimize by not recreating a new RegExp at each iteration
    if (isTitleFinderRegexUndefined || upperCaseFiltersHaveChanged) {
      this.upperCaseFilters = upperCaseFilters
      this.titleFinderRegex = new RegExp(upperCaseFilters.join('|'))
    }

    return this.titleFinderRegex.test(title.toUpperCase())
  }

}

class YoutubeVideosFinder {

  find() {
    const lis = document.getElementsByClassName('yt-shelf-grid-item')
    const videos = []

    for (const li of lis) {
      videos.push(new YoutubeVideo(li))
    }

    return videos
  }

}

class YoutubeVideo {

  constructor(element) {
    this.element = element
    this.title   = element.querySelector('h3 > a').innerHTML
  }

  display() {
    this.element.style.display = 'inline-block'
  }

  hide() {
    this.element.style.display = 'none'
  }

  isDisplayed() {
    return this.element.style.display !== 'none'
  }

  isHidden() {
    return this.element.style.display === 'none'
  }

}

function areArraysEqual(firstArray, secondArray) {
  return firstArray.length === secondArray.length && firstArray.every((value, index) => value === secondArray[index])
}

const videosManager = new VideosDisplayManager(browser)
