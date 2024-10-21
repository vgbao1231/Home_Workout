import SchedulePanel from './SchedulePanel/SchedulePanel';
import Slides from './Slides/Slides';
import './UserHomePage.scss';

export default function UserHomePage() {
    return (
        <div className="user-home">
            <Slides />
            <SchedulePanel />
        </div>
    );
};