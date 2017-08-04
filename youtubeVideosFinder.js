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
