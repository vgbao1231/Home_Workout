import { CalendarCheck2, ChartColumn, House, Images, LayoutDashboard, SquareUserRound } from 'lucide-react';
import Sidebar from '~/components/ui/Sidebar/Sidebar';
import SidebarItem from '~/components/ui/Sidebar/SidebarItem/SidebarItem';

const sidebarStyles = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };

export function AdminSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard />} text="Dashboard" path="/" />
                <SidebarItem icon={<SquareUserRound />} text="User Information" path="/manage-user-info" />
                <SidebarItem icon={<Images />} text="Slides" path="/manage-slides" />
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
                <SidebarItem icon={<House />} text="Home" path='/' />
                <SidebarItem icon={<CalendarCheck2 />} text="Schedules" path='/subscribe-schedules' />
            </Sidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}