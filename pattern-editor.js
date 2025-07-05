class PatternEditor {
    constructor() {
        this.patternInput = document.getElementById('patternEditor');
        this.currentPattern = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.patternInput.addEventListener('change', () => this.updatePattern());
    }

    updatePattern() {
        try {
            const inputPattern = JSON.parse(this.patternInput.value);
            if (Array.isArray(inputPattern)) {
                this.currentPattern = inputPattern.map(item => {
                    if (typeof item === 'number') {
                        return item;
                    } else if (typeof item === 'string') {
                        return this.convertStringToMs(item);
                    } else {
                        throw new Error('Invalid pattern item');
                    }
                });
                this.patternInput.classList.remove('error');
            } else {
                throw new Error('Pattern must be an array');
            }
        } catch (error) {
            console.error('Invalid pattern:', error);
            this.patternInput.classList.add('error');
            this.currentPattern = [];
        }
    }

    convertStringToMs(str) {
        const conversions = {
            'tick': 100,
            'tock': 200,
            'short': 50,
            'long': 300
        };
        return conversions[str.toLowerCase()] || 100; // Default to 100ms if unknown
    }

    getNextInterval() {
        if (this.currentPattern.length === 0) {
            return null; // Use default interval
        }
        const interval = this.currentPattern.shift();
        this.currentPattern.push(interval); // Move to end for looping
        return interval / 1000; // Convert ms to seconds
    }

    isPatternActive() {
        return this.currentPattern.length > 0;
    }
}

// Create a global pattern editor instance
window.patternEditor = new PatternEditor();
