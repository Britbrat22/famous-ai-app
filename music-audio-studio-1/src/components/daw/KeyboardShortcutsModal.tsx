import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { category: 'Transport', shortcuts: [
    { keys: ['Space'], action: 'Play / Pause' },
    { keys: ['Enter'], action: 'Stop and return to start' },
    { keys: ['R'], action: 'Start / Stop recording' },
  ]},
  { category: 'Editing', shortcuts: [
    { keys: ['Cmd/Ctrl', 'Z'], action: 'Undo' },
    { keys: ['Cmd/Ctrl', 'Shift', 'Z'], action: 'Redo' },
    { keys: ['Delete'], action: 'Delete selected clip' },
    { keys: ['Cmd/Ctrl', 'D'], action: 'Duplicate clip' },
    { keys: ['S'], action: 'Split clip at playhead' },
  ]},
  { category: 'Navigation', shortcuts: [
    { keys: ['Cmd/Ctrl', '+'], action: 'Zoom in' },
    { keys: ['Cmd/Ctrl', '-'], action: 'Zoom out' },
    { keys: ['Home'], action: 'Go to start' },
    { keys: ['End'], action: 'Go to end' },
  ]},
  { category: 'Tools', shortcuts: [
    { keys: ['V'], action: 'Select tool' },
    { keys: ['C'], action: 'Cut tool' },
    { keys: ['G'], action: 'Toggle snap to grid' },
    { keys: ['M'], action: 'Mute selected track' },
    { keys: ['Shift', 'S'], action: 'Solo selected track' },
  ]},
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2d2d2d] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#00d4ff]" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {SHORTCUTS.map((category, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, sidx) => (
                  <div
                    key={sidx}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#1a1a1a]"
                  >
                    <span className="text-sm text-gray-300">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, kidx) => (
                        <React.Fragment key={kidx}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-[#3a3a3a] text-white rounded">
                            {key}
                          </kbd>
                          {kidx < shortcut.keys.length - 1 && (
                            <span className="text-gray-500 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#3a3a3a] bg-[#252525]">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 text-xs bg-[#3a3a3a] rounded">?</kbd> anytime to show this panel
          </p>
        </div>
      </div>
    </div>
  );
};
