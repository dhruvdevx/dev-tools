const lengthInput   = document.getElementById('length');
const lengthValue   = document.getElementById('lengthValue');
const lowercaseInput = document.getElementById('lowercase');
const uppercaseInput = document.getElementById('uppercase');
const numbersInput   = document.getElementById('numbers');
const symbolsInput   = document.getElementById('symbols');
const passwordField  = document.getElementById('password');
const generateBtn    = document.getElementById('generate');
const copyBtn        = document.getElementById('copy');
const toast          = document.getElementById('toast');

const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars    = '0123456789';
const symbolChars    = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

const shuffle = (str) => [...str].sort(() => Math.random() - 0.5).join('');

function generatePassword(){
  const length = +lengthInput.value;
  let charPool = '';
  let mandatory = [];

  if(lowercaseInput.checked){
    charPool += lowercaseChars;
    mandatory.push(randomChar(lowercaseChars));
  }
  if(uppercaseInput.checked){
    charPool += uppercaseChars;
    mandatory.push(randomChar(uppercaseChars));
  }
  if(numbersInput.checked){
    charPool += numberChars;
    mandatory.push(randomChar(numberChars));
  }
  if(symbolsInput.checked){
    charPool += symbolChars;
    mandatory.push(randomChar(symbolChars));
  }
  if(!charPool) return '';

  let password = '';
  for(let i = mandatory.length; i < length; i++){
    password += randomChar(charPool);
  }
  password += mandatory.join('');
  return shuffle(password);
}

function randomChar(pool){
  return pool[Math.floor(Math.random()*pool.length)];
}

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 3000);
}

lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener('click', () => {
  const pwd = generatePassword();
  passwordField.value = pwd;
  passwordField.focus();
  passwordField.select();
  showToast('Password generated!');
});

copyBtn.addEventListener('click', () => {
  if(!passwordField.value) return;
  navigator.clipboard.writeText(passwordField.value);
  showToast('Copied to clipboard!');
});
