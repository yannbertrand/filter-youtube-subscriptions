const form = document.forms[0]
const filtersInput = form.elements[0]

initalize()

form.addEventListener('submit', submit)

function initalize() {
  filtersInput.value = localStorage.getItem('filters') || ''
}

function submit(event) {
  event.preventDefault()

  const filters = getFiltersFromInputValue(filtersInput.value)
  localStorage.setItem('filters', filters)

  refresh()

  function getFiltersFromInputValue(filtersString) {
    return filtersString.split(',').map(filterString => filterString.trim())
  }
}

function refresh() {

}
