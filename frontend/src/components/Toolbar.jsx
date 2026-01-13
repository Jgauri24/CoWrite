import React, { useState, useEffect } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    List,
    ListOrdered
} from 'lucide-react';

const Toolbar = () => {
    // Track active formats to highlight buttons
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        h1: false,
        h2: false,
        ul: false,
        ol: false
    });

    useEffect(() => {
        const checkFormats = () => {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            setActiveFormats({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                h1: document.queryCommandValue('formatBlock') === 'h1',
                h2: document.queryCommandValue('formatBlock') === 'h2',
                ul: document.queryCommandState('insertUnorderedList'),
                ol: document.queryCommandState('insertOrderedList')
            });
        };

        document.addEventListener('selectionchange', checkFormats);
        return () => document.removeEventListener('selectionchange', checkFormats);
    }, []);

    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        // Refocus the editor if needed, but execCommand usually keeps focus or works on selection
    };

    const ToolbarButton = ({ isActive, onClick, icon: Icon, label }) => (
        <button
            onClick={(e) => {
                e.preventDefault(); // Prevent losing focus
                onClick();
            }}
            className={`p-2 rounded-md transition-colors ${isActive
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar)] hover:text-[var(--color-text)]'
                }`}
            title={label}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <div className="flex items-center gap-1 px-4 py-2 bg-[var(--color-card)] border-b border-[var(--color-border)] sticky top-0 z-10 overflow-x-auto">
            <ToolbarButton
                isActive={activeFormats.bold}
                onClick={() => applyFormat('bold')}
                icon={Bold}
                label="Bold"
            />
            <ToolbarButton
                isActive={activeFormats.italic}
                onClick={() => applyFormat('italic')}
                icon={Italic}
                label="Italic"
            />
            <ToolbarButton
                isActive={activeFormats.underline}
                onClick={() => applyFormat('underline')}
                icon={Underline}
                label="Underline"
            />

            <div className="w-px h-6 bg-[var(--color-border)] mx-2" />

            <ToolbarButton
                isActive={activeFormats.h1}
                onClick={() => applyFormat('formatBlock', 'H1')}
                icon={Heading1}
                label="Heading 1"
            />
            <ToolbarButton
                isActive={activeFormats.h2}
                onClick={() => applyFormat('formatBlock', 'H2')}
                icon={Heading2}
                label="Heading 2"
            />

            <div className="w-px h-6 bg-[var(--color-border)] mx-2" />

            <ToolbarButton
                isActive={activeFormats.ul}
                onClick={() => applyFormat('insertUnorderedList')}
                icon={List}
                label="Bullet List"
            />
            <ToolbarButton
                isActive={activeFormats.ol}
                onClick={() => applyFormat('insertOrderedList')}
                icon={ListOrdered}
                label="Numbered List"
            />
        </div>
    );
};

export default Toolbar;
