function generatePassword() {
    // Character sets for password generation
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Combine all character sets
    const allCharacters = lowercase + uppercase + numbers + symbols;

    let password = "";
    const passwordLength = 12;

    // Ensure at least one character from each set
    password += getRandomChar(lowercase);
    password += getRandomChar(uppercase);
    password += getRandomChar(numbers);
    password += getRandomChar(symbols);

    // Fill the rest with random characters
    for (let i = 4; i < passwordLength; i++) {
        password += getRandomChar(allCharacters);
    }

    // Shuffle the password to avoid predictable patterns
    password = shuffleString(password);

    // Set the password in the input field
    const passwordInput = document.getElementById("password");
    passwordInput.value = password;

    // Optional: Auto-select the password for easy copying
    passwordInput.select();
    passwordInput.setSelectionRange(0, 99999); // For mobile devices

    // Add a subtle animation to show the password was generated
    passwordInput.style.background = "#e8f5e8";
    setTimeout(() => {
        passwordInput.style.background = "white";
    }, 500);
}

function getRandomChar(charset) {
    return charset.charAt(Math.floor(Math.random() * charset.length));
}

function shuffleString(str) {
    return str.split('').sort(() => 0.5 - Math.random()).join('');
}

// Allow generating password with Enter key
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generatePassword();
        }
    });
});

// Optional: Add copy to clipboard functionality
function copyPassword() {
    const passwordInput = document.getElementById("password");
    if (passwordInput.value) {
        passwordInput.select();
        passwordInput.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            // Could add a tooltip or notification here
        } catch (err) {
            console.log('Copy failed, but password is selected for manual copy');
        }
    }
}