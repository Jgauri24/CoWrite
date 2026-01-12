

import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FileText, Plus } from 'lucide-react';
import { documentsAPI } from '../services/api';

const Home = () => {
    const navigate = useNavigate();

    const handleNewDocument = async () => {
        try {
            const response = await documentsAPI.create({ title: 'Untitled Document' });
            navigate(`/document/${response.data._id}`);
        } catch (error) {
            console.error('Failed to create document:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
            <Topbar />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                {/* Empty State / Welcome */}
                <main className="flex-1 flex items-center justify-center p-10 bg-[var(--color-bg)]">
                    <div className="text-center p-12 max-w-[400px] animate-fadeIn">
                        <div className="w-20 h-20 rounded-full bg-[var(--color-sidebar)] flex items-center justify-center mx-auto mb-6 text-[var(--color-accent)]">
                            <FileText size={48} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-[var(--color-text)]">Welcome to CoWrite</h2>
                        <p className="text-[var(--color-text-secondary)] mb-8">
                            Create a new document or select one from the sidebar to get started.
                        </p>
                        <button
                            onClick={handleNewDocument}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-md transition-colors mx-auto"
                        >
                            <Plus size={18} />
                            Create New Document
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;
