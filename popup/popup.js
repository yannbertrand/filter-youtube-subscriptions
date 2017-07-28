var browser = browser || chrome

const form = document.forms[0]
const filtersInput = form.elements[0]

browser.runtime.sendMessage({ type: 'get-filters' }, getFilters)

form.addEventListener('submit', submit)

function getFilters(filters) {
  filtersInput.value = filters.join(', ')
}

function submit(event) {
  event.preventDefault()

  const filters = getFiltersFromInputValue(filtersInput.value)
  browser.runtime.sendMessage({ type: 'set-filters', filters })

  function getFiltersFromInputValue(filtersString) {
    return filtersString.split(',').map(filterString => filterString.trim())
  }
}
