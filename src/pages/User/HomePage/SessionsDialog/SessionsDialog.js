import { useCallback, useEffect, useState } from 'react';
import './SessionsDialog.scss';
import { SessionUserService } from '~/services/sessionService';

export default function SessionsDialog({ scheduleId }) {
    const [ sessionsData, setSessionsData ] = useState([]);

    const handleClickSession = useCallback((e, sessionId) => {

    }, []);

    useEffect(() => {
        SessionUserService.getSessionsOfScheduleRelationship(scheduleId)
            .then(response => {
                setSessionsData(response.data.sort((a, b) => a.ordinal - b.ordinal));
            })
            .catch(error => setSessionsData([]));
    }, []);

    return <ul className="sessions-dialog-in-home">
        {sessionsData.length === 0
            ? <div>Loading</div>
            : sessionsData.map((dataObj, index) => ItemOfListBuilder(dataObj, index, handleClickSession))
        }
    </ul>;
}


function ItemOfListBuilder(dataObj, index, handleClickSession) {
    return <li key={"list-content_row-" + index} className="list-content_row"
            onClick={e => handleClickSession(e, dataObj.session.sessionId)}>
        <div className="list-content_cell">
            <i>{dataObj.ordinal}</i>
        </div>
        <div className="list-content_cell">
            <span className="list-content_cell_name">{dataObj.session.name}</span>
            <span className="list-content_cell_description">{dataObj.session.description}</span>
        </div>
        <div className="list-content_cell">
            <i plain={dataObj.session.levelEnum}>{dataObj.session.levelEnum}</i>
            <i plain="muscles">{dataObj.session.muscles.map(m => m.muscleName).join(" - ")}</i>
        </div>
    </li>;
}