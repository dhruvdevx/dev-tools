function generatePassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  document.getElementById("password").value = password;
}
