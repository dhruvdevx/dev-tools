// ──────────────────────────────────────────────
// Password Generator Script - Enhanced Version
// Dhruv Upadhyay Developer Tools
// ────────────────────────────────────────────── 

class SecurePasswordGenerator {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.updateLengthDisplay();
        
        // Character sets for password generation
        this.charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };
    }

    initializeElements() {
        // Main elements
        this.passwordInput = document.getElementById('password');
        this.lengthSlider = document.getElementById('length');
        this.lengthValue = document.getElementById('lengthValue');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.toast = document.getElementById('toast');

        // Checkboxes
        this.uppercaseCheck = document.getElementById('uppercase');
        this.lowercaseCheck = document.getElementById('lowercase');
        this.numbersCheck = document.getElementById('numbers');

        this.symbolsCheck = document.getElementById('symbols');
    }

    setupEventListeners() {
        // Length slider
        this.lengthSlider.addEventListener('input', () => {
            this.updateLengthDisplay();
        });

        // Generate button
        this.generateBtn.addEventListener('click', () => {
            this.generatePassword();
        });

        // Copy button
        this.copyBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Enter key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generatePassword();
            }
        });

        // Auto-generate on checkbox change
        [this.uppercaseCheck, this.lowercaseCheck, this.numbersCheck, this.symbolsCheck].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (this.passwordInput.value) {
                    this.generatePassword();
                }
            });
        });

        // Auto-generate on length change
        this.lengthSlider.addEventListener('change', () => {
            if (this.passwordInput.value) {
                this.generatePassword();
            }
        });
    }

    updateLengthDisplay() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }

    getSelectedCharacterSets() {
        let characterSet = '';
        const selectedSets = [];

        if (this.uppercaseCheck.checked) {
            characterSet += this.charSets.uppercase;
            selectedSets.push(this.charSets.uppercase);
        }
        if (this.lowercaseCheck.checked) {
            characterSet += this.charSets.lowercase;
            selectedSets.push(this.charSets.lowercase);
        }
        if (this.numbersCheck.checked) {
            characterSet += this.charSets.numbers;
            selectedSets.push(this.charSets.numbers);
        }
        if (this.symbolsCheck.checked) {
            characterSet += this.charSets.symbols;
            selectedSets.push(this.charSets.symbols);
        }

        return { characterSet, selectedSets };
    }

    generateSecurePassword(length, characterSet, selectedSets) {
        if (characterSet.length === 0) {
            throw new Error('At least one character type must be selected');
        }

        // Use Web Crypto API for cryptographically secure randomness
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        let password = '';
        
        // Ensure at least one character from each selected set
        selectedSets.forEach(set => {
            const randomIndex = array[password.length] % set.length;
            password += set[randomIndex];
        });

        // Fill the rest of the password
        for (let i = password.length; i < length; i++) {
            const randomIndex = array[i] % characterSet.length;
            password += characterSet[randomIndex];
        }

        // Shuffle the password to avoid predictable patterns
        return this.shuffleString(password, array);
    }

    shuffleString(str, randomArray) {
        const array = str.split('');
        
        // Fisher-Yates shuffle with crypto random values
        for (let i = array.length - 1; i > 0; i--) {
            const j = randomArray[i] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        
        return array.join('');
    }

    generatePassword() {
        try {
            const length = parseInt(this.lengthSlider.value);
            const { characterSet, selectedSets } = this.getSelectedCharacterSets();

            if (selectedSets.length === 0) {
                this.showError('Please select at least one character type');
                return;
            }

            const password = this.generateSecurePassword(length, characterSet, selectedSets);
            
            this.passwordInput.value = password;
            this.passwordInput.select();
            
            // Add visual feedback
            this.addGenerationFeedback();
            
        } catch (error) {
            console.error('Password generation error:', error);
            this.showError('Error generating password. Please try again.');
        }
    }

    addGenerationFeedback() {
        // Add a subtle animation to indicate generation
        this.passwordInput.style.transform = 'scale(1.02)';
        this.passwordInput.style.transition = 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            this.passwordInput.style.transform = 'scale(1)';
        }, 150);
    }

    async copyToClipboard() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('No password to copy. Generate one first!');
            return;
        }

        try {
            // Use modern Clipboard API
            await navigator.clipboard.writeText(password);
            this.showToast('Password copied to clipboard!');
            
            // Visual feedback for copy button
            this.copyBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.copyBtn.style.transform = 'scale(1)';
            }, 100);
            
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(password);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Password copied to clipboard!');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showError('Unable to copy password. Please select and copy manually.');
        }
        
        document.body.removeChild(textArea);
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    showError(message) {
        // Create temporary error toast
        const errorToast = this.toast.cloneNode(true);
        errorToast.textContent = message;
        errorToast.style.background = '#ef4444';
        errorToast.classList.add('show');
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
            errorToast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(errorToast);
            }, 300);
        }, 3000);
    }

    // Public method to generate password (can be called externally)
    generate() {
        this.generatePassword();
    }
}

// Initialize the password generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Web Crypto API is available
    if (!window.crypto || !window.crypto.getRandomValues) {
        console.error('Web Crypto API not available. Password security may be compromised.');
    }

    // Initialize the password generator
    window.passwordGenerator = new SecurePasswordGenerator();
    
    // Generate an initial password
    window.passwordGenerator.generate();
    
    // Add some helpful console messages for developers
    console.log('🔐 Secure Password Generator initialized');
    console.log('💡 Features: Cryptographically secure, client-side only, no data transmitted');
    console.log('🛡️ Security: Uses Web Crypto API for true randomness');
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurePasswordGenerator;
}
