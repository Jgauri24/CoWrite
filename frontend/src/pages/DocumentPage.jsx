

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Editor from '../components/Editor';
import Toolbar from '../components/Toolbar';
import ActiveUsers from '../components/ActiveUsers';
import SaveStatus from '../components/SaveStatus';
import { useDocument } from '../hooks/useDocument';
import { Share2, ArrowLeft } from 'lucide-react';

const DocumentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        content,
        setContent,
        title,
        setTitle,
        activeUsers,
        isLoading,
        error,
        connectionStatus,
        lastSaved,
        saveDocument
    } = useDocument(id);

    const [saveStatus, setSaveStatus] = useState('saved');


    useEffect(() => {
        if (connectionStatus === 'disconnected' || connectionStatus === 'reconnecting') {
            setSaveStatus('offline');
        } else {
            if (lastSaved) {
                setSaveStatus('saved');
            }
        }
    }, [connectionStatus, lastSaved]);

    // Handle content changes
    const handleContentChange = useCallback((newContent) => {
        setContent(newContent);
        setSaveStatus('saving');

        clearTimeout(window.saveTimeout);
        window.saveTimeout = setTimeout(() => {
            saveDocument({ content: newContent, title });
        }, 1000);
    }, [title, saveDocument, setContent]);

    const handleTitleChange = useCallback((newTitle) => {
        setTitle(newTitle);
        setSaveStatus('saving');

        clearTimeout(window.titleSaveTimeout);
        window.titleSaveTimeout = setTimeout(() => {
            saveDocument({ content, title: newTitle });
            // Remove the immediate 'saved' set
        }, 500);
    }, [content, saveDocument, setTitle]);


    useEffect(() => {
        return () => {
            clearTimeout(window.saveTimeout);
            clearTimeout(window.titleSaveTimeout);
        };
    }, []);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[var(--color-bg)]">
                <div className="py-15 px-6 md:px-15 max-w-[900px] mx-auto w-full">
                    <div className="h-10 w-1/2 bg-[var(--color-border)] rounded-lg mb-8 animate-pulse" />
                    <div className="h-5 w-full bg-[var(--color-border)] rounded mb-4 animate-pulse" />
                    <div className="h-5 w-3/4 bg-[var(--color-border)] rounded mb-4 animate-pulse" />
                    <div className="h-5 w-1/2 bg-[var(--color-border)] rounded animate-pulse" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-screen text-center p-10 bg-[var(--color-bg)]">
                <h2 className="text-xl font-semibold text-[var(--color-error)] mb-3">Unable to load document</h2>
                <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-md transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Document Header */}
            <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-card)]">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar)] hover:text-[var(--color-text)] transition-colors"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <SaveStatus status={saveStatus} />
                </div>

                <div className="flex items-center gap-3">
                    <ActiveUsers users={activeUsers} />
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setSaveStatus('copied');
                            setTimeout(() => setSaveStatus('saved'), 2000);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[var(--color-border)] rounded-md hover:bg-[var(--color-sidebar)] transition-colors"
                    >
                        <Share2 size={16} />
                        <span className="hidden sm:inline">
                            {saveStatus === 'copied' ? 'Copied!' : 'Share'}
                        </span>
                    </button>
                </div>
            </header>

            {/* Editor */}
            <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] flex flex-col">
                <Toolbar />
                <Editor
                    content={typeof content === 'string' ? content : ''}
                    title={title}
                    onChange={handleContentChange}
                    onTitleChange={handleTitleChange}
                />
            </main>

            {/* Presence Footer */}
            {activeUsers.length > 1 && (
                <footer className="px-5 py-2 bg-[var(--color-sidebar)] border-t border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] text-center">
                    {activeUsers.slice(0, 2).map((u, i) => (
                        <span key={u.id}>
                            {i > 0 && ', '}
                            {u.name}
                        </span>
                    ))}
                    {activeUsers.length > 2 && ` and ${activeUsers.length - 2} others`}
                    {' '}viewing
                </footer>
            )}
        </div>
    );
};

export default DocumentPage;
