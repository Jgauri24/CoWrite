

import { useRef, useEffect, useCallback, useState } from 'react';
import { getSocket } from '../services/socket';

const Editor = ({
    content,
    onChange,
    onTitleChange,
    title,
    isReadOnly = false
}) => {
    const editorRef = useRef(null);
    const isLocalChange = useRef(false);
    const lastContent = useRef(content);

    // Store remote cursors: { userId: { name, index, color } }
    const [remoteCursors, setRemoteCursors] = useState({});

    // Colors for different users
    const cursorColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    const getUserColor = (userId) => {
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return cursorColors[Math.abs(hash) % cursorColors.length];
    };

    // Set initial content
    useEffect(() => {
        if (editorRef.current && content !== undefined) {
            if (!isLocalChange.current) {
                editorRef.current.innerHTML = content || '';
            }
            lastContent.current = content;
        }
    }, [content]);

    // Handle Cursor/Selection tracking
    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection.rangeCount || isReadOnly) return;

            const range = selection.getRangeAt(0);
            const editorNode = editorRef.current;

            // Ensure selection is inside OUR editor
            if (!editorNode?.contains(range.commonAncestorContainer)) return;


            const cursorData = {
                index: range.startOffset, 
                // You might need a robust library for exact absolute position
            };

            const socket = getSocket();
            if (socket) {
                socket.emit('send-cursor', cursorData);
            }
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, [isReadOnly]);


    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleRemoteChanges = (delta) => {
            if (editorRef.current) {
                const selection = window.getSelection();
                const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
                const cursorOffset = range ? range.startOffset : 0;

                isLocalChange.current = false;
                editorRef.current.innerHTML = delta.content;
                lastContent.current = delta.content;

                try {
                    if (range && editorRef.current.firstChild) {
                        const newRange = document.createRange();
                        const node = editorRef.current.firstChild;
                        const offset = Math.min(cursorOffset, node.textContent?.length || 0);
                        newRange.setStart(node, offset);
                        newRange.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                } catch (e) {
           
                }
            }
        };

        const handleRemoteCursor = (data) => {
            setRemoteCursors(prev => ({
                ...prev,
                [data.userId]: {
                    name: data.userName,
                    index: data.index, // We'll just show markers at the top for now as "Presence"
                    color: getUserColor(data.userId),
                    updatedAt: Date.now()
                }
            }));


        };

        const handleTitleChange = (newTitle) => {
            onTitleChange?.(newTitle);
        };

        socket.on('receive-changes', handleRemoteChanges);
        socket.on('receive-cursor', handleRemoteCursor);
        socket.on('title-changed', handleTitleChange);

        return () => {
            socket.off('receive-changes', handleRemoteChanges);
            socket.off('receive-cursor', handleRemoteCursor);
            socket.off('title-changed', handleTitleChange);
        };
    }, [onTitleChange]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            const newContent = editorRef.current.innerHTML;

            if (newContent === lastContent.current) return;

            isLocalChange.current = true;
            lastContent.current = newContent;

            onChange?.(newContent);

            const socket = getSocket();
            if (socket) {
                socket.emit('send-changes', { content: newContent });
            }
        }
    }, [onChange]);

    // Handle title change
    const handleTitleBlur = useCallback((e) => {
        const newTitle = e.target.value.trim() || 'Untitled Document';
        onTitleChange?.(newTitle);

        const socket = getSocket();
        if (socket) {
            socket.emit('update-title', newTitle);
        }
    }, [onTitleChange]);

    return (
        <div className="flex-1 flex flex-col py-10 px-6 md:px-15 max-w-[900px] mx-auto w-full relative">
            {/* Active remote cursors indicators (Simple Presence Header) */}
            <div className="absolute top-2 right-6 flex gap-2">
                {Object.values(remoteCursors).map((cursor) => (
                    <div
                        key={cursor.name}
                        className="text-xs px-2 py-1 rounded-full text-white shadow-sm transition-all animate-in fade-in zoom-in"
                        style={{ backgroundColor: cursor.color }}
                    >
                        {cursor.name} is typing...
                    </div>
                ))}
            </div>

            {/* Document Title */}
            <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange?.(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Untitled Document"
                disabled={isReadOnly}
                className="text-2xl md:text-3xl font-bold border-none bg-transparent text-[var(--color-text)] p-0 mb-6 w-full focus:outline-none focus:ring-0 placeholder:text-[var(--color-text-secondary)]"
            />

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable={!isReadOnly}
                onInput={handleInput}
                data-placeholder="Start typing..."
                suppressContentEditableWarning
                className="flex-1 text-base leading-relaxed text-[var(--color-text)] outline-none min-h-[400px]
          empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-text-secondary)] empty:before:pointer-events-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:my-3
          [&_p]:mb-3
          [&_ul]:ml-6 [&_ul]:mb-3 [&_ol]:ml-6 [&_ol]:mb-3
          [&_code]:font-mono [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
          [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
          [&_pre_code]:bg-transparent [&_pre_code]:p-0"
            />
        </div>
    );
};

export default Editor;
