
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Users } from 'lucide-react';
import { documentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ currentDocId, onDocumentSelect }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch documents on mount
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await documentsAPI.getAll();
            setDocuments(response.data);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Separate owned vs shared documents
    const myDocs = documents.filter(doc => doc.owner._id === user?.id || doc.owner === user?.id);
    const sharedDocs = documents.filter(doc => doc.owner._id !== user?.id && doc.owner !== user?.id);

    // Create new document
    const handleNewDocument = async () => {
        try {
            const response = await documentsAPI.create({ title: 'Untitled Document' });
            const newDoc = response.data;
            setDocuments([newDoc, ...documents]);
            navigate(`/document/${newDoc._id}`);
        } catch (error) {
            console.error('Failed to create document:', error);
        }
    };

    // Format relative time
    const formatTime = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diff = Math.floor((now - then) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <aside className="w-64 min-w-64 h-screen bg-muted/30 border-r border-border p-4 overflow-y-auto sticky top-0">
            {/* New Document Button */}
            <button
                onClick={handleNewDocument}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-6 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
            >
                <Plus size={18} />
                New Document
            </button>

            {/* My Documents */}
            <section className="mb-6">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    Your Documents
                </h3>
                {isLoading ? (
                    <div className="space-y-2">
                        <div className="h-10 bg-muted rounded-md animate-pulse" />
                        <div className="h-10 bg-muted rounded-md animate-pulse" />
                    </div>
                ) : myDocs.length === 0 ? (
                    <p className="text-sm text-muted-foreground px-2.5 py-2">No documents yet</p>
                ) : (
                    <ul className="space-y-1">
                        {myDocs.map(doc => (
                            <li
                                key={doc._id}
                                onClick={() => {
                                    navigate(`/document/${doc._id}`);
                                    onDocumentSelect?.(doc._id);
                                }}
                                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-md cursor-pointer transition-colors
                                    ${doc._id === currentDocId
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm font-medium truncate">{doc.title}</span>
                                    <span className={`text-xs ${doc._id === currentDocId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {formatTime(doc.updatedAt)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Shared Documents */}
            {sharedDocs.length > 0 && (
                <section className="mb-6">
                    <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                        <Users size={14} />
                        Shared with You
                    </h3>
                    <ul className="space-y-1">
                        {sharedDocs.map(doc => (
                            <li
                                key={doc._id}
                                onClick={() => {
                                    navigate(`/document/${doc._id}`);
                                    onDocumentSelect?.(doc._id);
                                }}
                                className={`flex items-center gap-2.5 px-2.5 py-2.5 rounded-md cursor-pointer transition-colors
                                    ${doc._id === currentDocId
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <span className="block text-sm font-medium truncate">{doc.title}</span>
                                    <span className={`text-xs ${doc._id === currentDocId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                        {formatTime(doc.updatedAt)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </aside>
    );
};

export default Sidebar;
