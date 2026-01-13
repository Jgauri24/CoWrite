

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
                <main className="flex-1 flex items-center justify-center p-10 bg-[var(--color-bg)] relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-violet-50/50 pointer-events-none" />

                    <div className="relative text-center p-12 max-w-[480px] animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <FileText size={48} className="text-indigo-600/80" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight text-[var(--color-text)]">Welcome to CoWrite</h2>
                        <p className="text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed text-balance">
                            Your minimalist workspace for thoughts and ideas. <br />
                            Select a document or create a new one to begin.
                        </p>
                        <button
                            onClick={handleNewDocument}
                            className="group flex items-center justify-center gap-2 px-6 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mx-auto"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            Create New Document
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;
