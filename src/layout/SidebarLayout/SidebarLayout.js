import { CalendarCheck2, Dumbbell, House, Images, LayoutDashboard, SquareUserRound, TableProperties } from 'lucide-react';
import AdminSidebar from '~/components/ui/Sidebar/AdminSidebar/AdminSidebar';
import SidebarItem from '~/components/ui/Sidebar/SidebarItem/SidebarItem';
import UserSidebar from '~/components/ui/Sidebar/UserSidebar/UserSidebar';

const sidebarStyles = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };

export function AdminSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <AdminSidebar>
                <SidebarItem icon={<LayoutDashboard />} text="Dashboard" path="/" />
                <SidebarItem icon={<SquareUserRound />} text="User Information" path="/manage-user-info" />
                <SidebarItem icon={<Images />} text="Slides" path="/manage-slides" />
                <SidebarItem icon={<TableProperties />} text="Schedule Dataset" path="/manage-decision-schedule-dataset" />
            </AdminSidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}


export function UserSidebarLayout({ children }) {
    return (
        <div className="container" style={sidebarStyles}>
            <UserSidebar>
                <SidebarItem icon={<House />} text="Home" path='/' />
                <SidebarItem icon={<CalendarCheck2 />} text="Schedules" path='/subscribe-schedules' />
                <SidebarItem icon={<Dumbbell />} text="Generate Schedules" path='/generate-schedules' />
            </UserSidebar>
            <div className="content" style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
}