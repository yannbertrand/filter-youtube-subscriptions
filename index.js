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

  for (const li of lis) {
    const title = li.querySelector('h3 > a').innerHTML
    const upperCaseTitle = title.toUpperCase()
    if (new RegExp(videosToHide.join('|')).test(upperCaseTitle)) {
      hiddenVideos.push(title)
      li.style.display = 'none'
    } else if (li.style.display === 'none') {
      displayedVideos.push(title)
      li.style.display = 'inline-block'
    }
  }

  if (hiddenVideos.length > 0) {
    console.groupCollapsed(`Hiding ${hiddenVideos.length} videos`)

    for (const title of hiddenVideos) {
      console.log(title)
    }

    console.groupEnd()
  }

  if (displayedVideos.length > 0) {
    console.groupCollapsed(`Displaying ${displayedVideos.length} videos`)

    for (const title of displayedVideos) {
      console.log(title)
    }

    console.groupEnd()
  }
}
