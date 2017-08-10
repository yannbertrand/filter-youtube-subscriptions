class VideosDisplayManager {

  constructor(videosFinder) {
    this.videosFinder     = videosFinder
    this.filters          = []
    this.upperCaseFilters = []
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
    const videos          = this.videosFinder.find()
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

function areArraysEqual(firstArray, secondArray) {
  return firstArray.length === secondArray.length && firstArray.every((value, index) => value === secondArray[index])
}
