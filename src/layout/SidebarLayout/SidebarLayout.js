import { ChartColumn, LayoutDashboard, SquareUserRound } from 'lucide-react';
import Sidebar from '~/components/ui/Sidebar/Sidebar';
import SidebarItem from '~/components/ui/Sidebar/SidebarItem/SidebarItem';

const sidebarStyles = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };

export function AdminSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard />} text="Dashboard" path="/admin/dashboard" />
                <SidebarItem icon={<ChartColumn />} text="Statistic" path="/admin/dashboard" />
                <SidebarItem icon={<SquareUserRound />} text="Account" path="/admin/manage-user-info" />
            </Sidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}


export function UserSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <Sidebar>
                
            </Sidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}