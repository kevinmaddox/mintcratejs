// Store MintCrate path variables to be imported later by example projects
window.mintCratePaths = {
  local:  "../../mintcratejs/core.js",
  remote: "https://cdn.jsdelivr.net/gh/kevinmaddox/mintcratejs@master/mintcratejs/core.js"
};

// Main content wrappers
let wrapper = createElement('div', 'wrapper');
let subWrapper = createElement('div', 'sub-wrapper');
wrapper.append(subWrapper);

// Page title headers
subWrapper.append(createElement('h1', '', GAME_INFO.TITLE));
subWrapper.append(createElement('h2', '', 'MintCrate Examples'));

// Game window scaling buttons
let scaleBtnContainer = createElement('p');

let scaleBtnMinus = createElement('span', 'scale-btn', '-');
let scaleBtnPlus = createElement('span', 'scale-btn', '+');

scaleBtnMinus.dataset.val = '-1';
scaleBtnPlus.dataset.val = '1';

[scaleBtnMinus, scaleBtnPlus].forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (!window.mint) {
      return;
    }
    
    let val = Number(e.target.dataset.val);
    let newScale = window.mint.getScreenScale() + val;
    newScale = Math.max(newScale, 1);
    window.mint.setScreenScale(newScale);
  });
});

scaleBtnContainer.append(scaleBtnMinus);
scaleBtnContainer.append(scaleBtnPlus);
subWrapper.append(scaleBtnContainer);

// Game container
let gameContainer = createElement('div', 'game-container');
let mintCrateTarget = document.querySelector('#mintcrate-target');

gameContainer.append(mintCrateTarget);
subWrapper.append(gameContainer);

// Game controls information table
let controlsTable = createElement('table');

let cells = [];
cells.push([createElement('th', '', 'Controls')]);

GAME_INFO.CONTROLS.KEYBOARD.push(["1", "Toggle debug overlay"]);

for (const controlsType of ['Keyboard', 'Mouse']) {
  if (GAME_INFO.CONTROLS[controlsType.toUpperCase()]) {
    cells.push([createElement('th', '', controlsType)]);
  }
  
  for (const item of GAME_INFO.CONTROLS[controlsType.toUpperCase()]) {
    cells.push([
      createElement('td', '', item[0]),
      createElement('td', '', item[1])
    ]);
  }
}

for (const cellGroup of cells) {
  let row = createElement('tr');
  
  for (const cell of cellGroup) {
    if (cellGroup.length === 1) {
      cell.colSpan = '2';
    }
    row.append(cell);
  }
  
  controlsTable.append(row);
}

subWrapper.append(controlsTable);

// Return link
let returnLinkMain = createElement('p');
let returnLink = createElement('a', '', 'Return to Examples List');
returnLink.href = '#';

returnLinkMain.append(returnLink);
subWrapper.append(returnLinkMain);

// Information footer
let info = createElement('p', 'lighter', `
  Developed with <a href="https://github.com/kevinmaddox/mintcratejs">MintCrate</a><br>
  Code licensed under the <a href="https://github.com/kevinmaddox/mintcratejs/blob/main/LICENSE">MIT License</a><br>
  Assets and concepts &copy; <a href="https://github.com/kevinmaddox/">Kevin Maddox</a>, all rights reserved
`);

// Finalize
document.querySelector('body').prepend(wrapper);
wrapper.after(info);

// Convenience wrapper for creating HTML elements
function createElement(type, className = "", htmlContent = "") {
  let elem = document.createElement(type);
  if (className !== "") {
    elem.classList.add(className);
  }
  if (htmlContent !== "") {
    elem.innerHTML = htmlContent;
  }
  
  return elem;
}