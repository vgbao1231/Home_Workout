import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { addToast } from "~/redux/slices/toastSlice";
import { ScheduleUserService } from "~/services/scheduleService";
import './SchedulePanel.scss';
import { ListTodo } from "lucide-react";
import SessionsDialog from "../SessionsDialog/SessionsDialog";
import { Dialog } from "~/components";

export default function SchedulePanel() {
    const dispatch = useDispatch();
    const [ scheduleTab, setScheduleTab ] = useState(0);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const handleClickSchedule = useCallback((e, scheduleId) => {
        setDialogProps({
            isOpen: true,
            title: 'Sessions',
            body: <SessionsDialog scheduleId={scheduleId}/>
        });
    }, []);

    const tabsInfo = useMemo(() => [
        {
            tab: "Schedules In Progress",
            component: <NotCompletedSchedules handleClickSchedule={handleClickSchedule} dispatch={dispatch}/>
        },
        {
            tab: "Schedules Completed",
            component: <CompletedSchedules handleClickSchedule={handleClickSchedule} dispatch={dispatch}/>
        }
    ], []);
    
    return <>
        <div className="schedule-panel">
            <div className="tabs-bar">{
                tabsInfo.map((info, index) =>
                    <button
                        key={"schedule-panel_btn-" + index}
                        onClick={e => setScheduleTab(index)}
                        className={`switch-tab-btn` + (index==scheduleTab ? ' active' : '')}>
                        {info.tab}
                    </button>
                )
            }</div>
            <div className="tab">
                {tabsInfo[scheduleTab].component}
            </div>
        </div>
        <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
    </>;
}

function NotCompletedSchedules({ handleClickSchedule, dispatch }) {
    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        ScheduleUserService.getSchedulesOfUser(false)
            .then(response => {
                setScheduleData(response.data);
                dispatch(addToast(response.message, 'success'));
            })
            .catch(error => setScheduleData([]));
    }, []);

    return <ul className="tab-content">
        {scheduleData.length === 0
            ? <div>You haven't register any Schedule yet!</div>
            : scheduleData.map((data, index) => ItemOfListBuilder(data, index, handleClickSchedule))
        }
    </ul>;
}

function CompletedSchedules({ handleClickSchedule, dispatch }) {
    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        ScheduleUserService.getSchedulesOfUser(true)
            .then(response => {
                setScheduleData(response.data);
                dispatch(addToast(response.message, 'success'));
            })
            .catch(error => setScheduleData([]));
    }, []);

    return <ul className="tab-content">
        {scheduleData.length === 0
            ? <div>You haven't register any Schedule yet!</div>
            : scheduleData.map((data, index) => ItemOfListBuilder(data, index, handleClickSchedule))
        }
    </ul>;
}

function ItemOfListBuilder(dataObj, index, handleClickSchedule) {
    return <li key={"tab-content_row-" + index} className="tab-content_row"
            onClick={e => handleClickSchedule(e, dataObj.scheduleId)}>
        <div className="tab-content_cell">
            <ListTodo />
        </div>
        <div className="tab-content_cell">
            <span className="tab-content_cell_name">{dataObj.name}</span>
            <span className="tab-content_cell_description">{dataObj.description}</span>
        </div>
        <span className="tab-content_cell" plain={dataObj.levelEnum}>
            <i>{dataObj.levelEnum}</i>
        </span>
    </li>;
}