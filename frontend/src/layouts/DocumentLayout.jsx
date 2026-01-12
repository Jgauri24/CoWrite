
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const DocumentLayout = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />

      <div className="flex-1 flex overflow-hidden flex-col md:flex-row">

        <div className="hidden md:block">
          <Sidebar currentDocId={id} />
        </div>
        <div className="flex-1 flex overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DocumentLayout;
