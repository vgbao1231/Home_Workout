import { ChartColumn, LayoutDashboard, SquareUserRound } from 'lucide-react';
import Sidebar from '~/components/ui/Sidebar/Sidebar';
import SidebarItem from '~/components/ui/Sidebar/SidebarItem/SidebarItem';

function SidebarLayout({ children }) {
    return (
        <div className="container" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard />} text="Dashboard" path="/" active />
                <SidebarItem icon={<ChartColumn />} text="Statistic" path="/test" />
                <SidebarItem icon={<SquareUserRound />} text="Account" path="/homepage" />
            </Sidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}

export default SidebarLayout;
