class Settings {
    constructor() {
        this.defaultSettings = {
            darkMode: false,
            volume: 1,
            defaultInterval: 1,
            defaultUnit: 'seconds',
            scientificNotation: false
        };
        this.currentSettings = {...this.defaultSettings};
    }

    load() {
        const savedSettings = localStorage.getItem('timeIntervalAppSettings');
        if (savedSettings) {
            this.currentSettings = JSON.parse(savedSettings);
        }
        this.applySettings();
    }

    save() {
        localStorage.setItem('timeIntervalAppSettings', JSON.stringify(this.currentSettings));
    }

    applySettings() {
        // Apply dark mode
        document.body.classList.toggle('dark-mode', this.currentSettings.darkMode);

        // Set volume (assuming we have a gain node in the main audio context)
        if (window.gainNode) {
            window.gainNode.gain.setValueAtTime(this.currentSettings.volume, window.audioContext.currentTime);
        }

        // Set default interval and unit
        document.getElementById('intervalValue').value = this.currentSettings.defaultInterval;
        document.getElementById('intervalUnit').value = this.currentSettings.defaultUnit;

        // Toggle scientific notation
        this.toggleScientificNotation(this.currentSettings.scientificNotation);
    }

    toggleDarkMode() {
        this.currentSettings.darkMode = !this.currentSettings.darkMode;
        this.applySettings();
        this.save();
    }

    setVolume(volume) {
        this.currentSettings.volume = volume;
        this.applySettings();
        this.save();
    }

    setDefaultInterval(interval, unit) {
        this.currentSettings.defaultInterval = interval;
        this.currentSettings.defaultUnit = unit;
        this.save();
    }

    toggleScientificNotation(enabled) {
        this.currentSettings.scientificNotation = enabled;
        const intervalValue = document.getElementById('intervalValue');
        if (enabled) {
            intervalValue.step = 'any';
            intervalValue.placeholder = 'e.g., 1e-6';
        } else {
            intervalValue.step = '0.001';
            intervalValue.placeholder = 'Interval';
        }
        this.save();
    }

    exportSettings() {
        return JSON.stringify(this.currentSettings);
    }

    importSettings(settingsJson) {
        try {
            const importedSettings = JSON.parse(settingsJson);
            this.currentSettings = {...this.defaultSettings, ...importedSettings};
            this.applySettings();
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import settings:', error);
            return false;
        }
    }
}

// Create a global settings instance
window.appSettings = new Settings();

// Load settings when the script is loaded
window.appSettings.load();
