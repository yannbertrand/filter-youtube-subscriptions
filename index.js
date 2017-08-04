var browser = browser || chrome

let filters = []

browser.runtime.sendMessage({ type: 'get-filters' }, getFilters)
browser.runtime.onMessage.addListener(getFilters)

function getFilters(upToDateFilters) {
  filters = upToDateFilters
  hideVideos()
}

function hideVideos() {
  const noFilter = filters.length
  const lis = document.getElementsByClassName('yt-shelf-grid-item')
  const videosToHide = filters.map(title => title.toUpperCase())
  const regex = new RegExp(videosToHide.join('|'))
  const displayedVideos = []
  const hiddenVideos = []

  for (const li of lis) {
    const title = li.querySelector('h3 > a').innerHTML
    const upperCaseTitle = title.toUpperCase()
    if (noFilter && regex.test(upperCaseTitle)) {
      if (li.style.display !== 'none') {
        hiddenVideos.push(title)
        li.style.display = 'none'
      }
    } else {
      if (li.style.display === 'none') {
        displayedVideos.push(title)
        li.style.display = 'inline-block'
      }
    }
  }

  logVideosStateChange('Hiding', hiddenVideos)
  logVideosStateChange('Displaying', displayedVideos)
}

function logVideosStateChange(verb, videos) {
  if (videos.length === 0) {
    return
  }

  console.groupCollapsed(`${verb} ${videos.length} videos`)

  for (const title of videos) {
    console.info(title)
  }

  console.groupEnd()
}
