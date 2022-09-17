export default class SelectMe {
  constructor(element) {
    this.element = element;

    // Get all options as object
    this.options = getOptions(element.querySelectorAll('option'));

    // Create new dom elements
    this.selectElem = document.createElement('div');
    this.selectLabel = document.createElement('span');
    this.selectOptionsWrapper = document.createElement('ul');

    // Function to initialize
    init(this);
    
    // Hide original element
    element.style.display = 'none';

    // Add new element into the DOM
    element.after(this.selectElem);
  }

  get selectedOption() {
    return this.options.find(option => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  // Select new value
  selectValue(value) {
    const newSelectedOption = this.options.find(option => {
      return option.value === value
    });
    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.selectLabel.innerText = newSelectedOption.label;

    this.selectOptionsWrapper.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected');
    const newOption = this.selectOptionsWrapper.querySelector(`[data-value="${newSelectedOption.value}"]`);
    newOption.classList.add('selected');
    newOption.scrollIntoView({ block: 'nearest'});
  }
}

function init(selectObj) {
  // Setup wrapper
  selectObj.selectElem.classList.add('__select-me-container');
  selectObj.selectElem.tabIndex = 0;

  // Setup label
  selectObj.selectLabel.classList.add('__select-me-label');
  selectObj.selectLabel.innerText = selectObj.selectedOption.label;
  selectObj.selectElem.append(selectObj.selectLabel);

  // Setup options
  selectObj.selectOptionsWrapper.classList.add('__select-me-options');
  selectObj.options.forEach(option => {
    const optionElement = document.createElement('li');
    optionElement.classList.add('__select-me-option');
    optionElement.classList.toggle('selected', option.selected);
    optionElement.innerText = option.label;
    optionElement.dataset.value = option.value;
    optionElement.addEventListener('click', () => {
      selectObj.selectValue(option.value);
      selectObj.selectOptionsWrapper.classList.remove('show');
    });
    selectObj.selectOptionsWrapper.append(optionElement);
  });

  selectObj.selectElem.append(selectObj.selectOptionsWrapper);

  // Add event listener for dropdown click
  selectObj.selectLabel.addEventListener('click', () => {
    selectObj.selectOptionsWrapper.classList.toggle('show');
  });

  // Add event listener for dropdown blur
  selectObj.selectElem.addEventListener('blur', () => {
    selectObj.selectOptionsWrapper.classList.remove('show');
  });

  let debounceTimeout;
  let searchTerm;

  // Add event listener on key
  selectObj.selectElem.addEventListener('keydown', (e) => {
    switch(e.code) {
      case 'Space': {
        selectObj.selectOptionsWrapper.classList.toggle('show');
        break;
      }
      case 'ArrowUp': {
        const prevOption = selectObj.options[selectObj.selectedOptionIndex - 1];
        if (prevOption) {
          selectObj.selectValue(prevOption.value);
        }
        break;
      }
      case 'ArrowDown': {
        const nextOption = selectObj.options[selectObj.selectedOptionIndex + 1];
        if (nextOption) {
          selectObj.selectValue(nextOption.value);
        }
        break;
      }
      case 'Enter':
      case 'Escape': {
        selectObj.selectOptionsWrapper.classList.remove('show'); 
        break;
      }
      default: {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = "";
        }, 500);
        const searchedOption = selectObj.options.find(option => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });
        if (searchedOption) {
          selectObj.selectValue(searchedOption.value);
        }
      }
    }
  });
}

function getOptions(optionElements) {
  return [...optionElements].map(optionElem => {
    return {
      value: optionElem.value,
      label: optionElem.label,
      selected: optionElem.selected,
      element: optionElem
    }
  });
}