import St from 'gi://St';
import Meta from 'gi://Meta';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

let shortcutId;

export default class HideUnfocused extends Extension {
    constructor(meta) {
        super(meta);
        this.settings = this.getSettings('org.gnome.shell.extensions.hide-unfocused');
    }
    
    enable() {
        shortcutId = Main.wm.addKeybinding(
            "hide-unfocused-shortcut",
            this.settings,
            Meta.KeyBindingFlags.NONE,
            () => minimizeUnfocusedWindows() // Funzione di callback per minimizzare le finestre
        );
    }
    
    disable() {
        if (shortcutId) {
            Main.wm.removeKeybinding("hide-unfocused-shortcut"); // Rimuove la scorciatoia
            shortcutId = null;
        }
    }
}

function minimizeUnfocusedWindows() {
    const currentWindow = global.display.focus_window;
    const allWindows = global.get_window_actors()
        .map(actor => actor.meta_window)
        .filter(window => window !== currentWindow && window.get_window_type() === Meta.WindowType.NORMAL);
    allWindows.forEach(window => window.minimize());
}

