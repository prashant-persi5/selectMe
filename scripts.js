import SelectMe from './lib/selectMe/select-me.js';

document.querySelectorAll('.selectMe').forEach(element => {
  new SelectMe(element);
});
