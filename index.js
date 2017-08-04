var browser = browser || chrome

let filters = []

browser.runtime.sendMessage({ type: 'get-filters' }, getFilters)
browser.runtime.onMessage.addListener(getFilters)

function getFilters(upToDateFilters) {
  filters = upToDateFilters
  hideVideos()
}

function hideVideos() {
  const lis = document.getElementsByClassName('yt-shelf-grid-item')

  if (filters.length === 1 && filters[0].length === 0) {
    for (const li of lis) {
      if (li.style.display === 'none') {
        const title = li.querySelector('h3 > a').innerHTML
        console.log('Displaying "' + title + '"')
        li.style.display = 'inline-block'
      }
    }

    return
  }

  const videosToHide = filters.map(title => title.toUpperCase())
  const videos = {}
  const displayedVideos = []
  const hiddenVideos = []
  const regex = new RegExp(videosToHide.join('|'))

  for (const li of lis) {
    const title = li.querySelector('h3 > a').innerHTML
    const upperCaseTitle = title.toUpperCase()
    if (regex.test(upperCaseTitle)) {
      hiddenVideos.push(title)
      li.style.display = 'none'
    } else if (li.style.display === 'none') {
      displayedVideos.push(title)
      li.style.display = 'inline-block'
    }
  }

  logVideosStateChange('Hiding', hiddenVideos)
  logVideosStateChange('Displaying', displayedVideos)
}

function logVideosStateChange(verb, videos) {
  if (videos.length > 0) {
    console.groupCollapsed(`${verb} ${videos.length} videos`)

    for (const title of videos) {
      console.info(title)
    }

    console.groupEnd()
  }
}
