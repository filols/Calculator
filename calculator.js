const DISPLAY = document.querySelector('#display');
let operator;
let operandOffDisplay = 0;
let prevOperandOperatedOver;
let pendingOperand = true;
let operating = false;
addButtonListeners();

/*
  !operating: For when equals is repeatedly pressed without a new operator.
  Since subtraction and division is non-associative, the second operand
  needs to be stored when operated over. This operand is then repeatedly 
  placed as the second operand when the function is called and there has 
  been no new operator given. 
  
  For the other case: naturally, if an operator has been given, the value 
  on the display will be the second operand.
*/
function operate() {
  let operand = parseFloat(DISPLAY.textContent);

  if (!operator) return;
  if (!operating) {
    DISPLAY.textContent = operator(operand, operandOffDisplay)
  } else {
    DISPLAY.textContent = operator(operandOffDisplay, operand);
    operandOffDisplay = operand;
  }

  operating = false;
  pendingOperand = true;
}

function changeOperator(newOperator) {
  switch (newOperator) {
    case '+': 
      operator = ((a, b) => a + b)
      break;
    case '-': 
      operator = ((a, b) => a - b)
      break;
    case '*': 
      operator = ((a, b) => a * b)
      break;
    case '/': 
      operator = ((a, b) => a / b)
      break;
  }

  operating = true;
  pendingOperand = true;
  operandOffDisplay = parseFloat(DISPLAY.textContent);
}

function addDigit(digit) {
  if (pendingOperand){
    pendingOperand = false;
    DISPLAY.textContent = digit;
  } else {
    DISPLAY.textContent += digit;
  }
}

function addDecimal() {
  if (DISPLAY.textContent.includes('.')) return;

  DISPLAY.textContent += '.';
}

function clear() {
    DISPLAY.textContent = "0";
    operator = undefined;
    operandOffDisplay = 0;
    operating = false;
    pendingOperand = true;
}

function changeSign() {
  if (DISPLAY.textContent === 0) return;

  DISPLAY.textContent = `${parseFloat(DISPLAY.textContent) * -1}`;
}

function percent() {
  DISPLAY.textContent = `${parseFloat(DISPLAY.textContent) / 100}`
}

function addButtonListeners() {
  const buttons = document.querySelectorAll("#calculator button");

  buttons.forEach(button => {
    if (button.classList.contains('digit')) {
      button.addEventListener('click', () => addDigit(button.value));
    } else if (button.classList.contains('decimal')) {
      button.addEventListener('click', () => addDecimal());
    } else if (button.classList.contains('clear')) {
      button.addEventListener('click', () => clear());
    } else if (button.classList.contains('percent')) {
      button.addEventListener('click', () => percent());
    } else if (button.classList.contains('sign')) {
      button.addEventListener('click', () => changeSign());
    } else if (button.classList.contains('operator')) {
      button.addEventListener('click', () => {
        if (operating && !pendingOperand) operate();
        changeOperator(button.value);
      })
    } else if (button.classList.contains('equals')) {
      button.addEventListener('click', () => operate());
    }
  })

  // Only works for numbers.
  window.addEventListener('keydown', e => {
    buttons.forEach(button => {
      const dataKey = button.getAttribute('data-key');
      if (dataKey === e.key) {
        e.stopPropagation();
        e.preventDefault();
        button.click();
      }
    })
  })
}