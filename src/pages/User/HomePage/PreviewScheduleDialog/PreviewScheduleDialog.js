import { useCallback, useEffect, useState } from 'react';
import './PreviewScheduleDialog.scss';
import { ScheduleUserService } from '~/services/scheduleService';
import { BicepsFlexed } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';

export default function PreviewScheduleDialog({ scheduleId }) {
    const dispatch = useDispatch();
    const [ previewScheduleData, setPreviewScheduleData ] = useState({});
    const [ repRatio, setRepRatio ] = useState();

    const handleClickSession = useCallback((e, dataObj) => {
        document.location.href = `/start-session?id=${scheduleId}&ordinal=${dataObj.ordinal}`;
    }, []);

    const changeLevelsDifficulty = useCallback((e) => {
        if (window.confirm("This action may change your coins. Confirm?")) {
            ScheduleUserService.updateRepRatio({
                newRepRatio: Number.parseInt(e.target.value),
                scheduleId: scheduleId
            })
                .then(response => dispatch(addToast(response.message, "success")))
                .catch(error => dispatch(addToast(error.message, "error")));
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            const response = await ScheduleUserService.getPreviewScheduleToPerform(scheduleId);
            const data = { ...response.data };
            data.subscribedTimeAsDateObj = new Date(...data.subscription.subscribedTime);
            if (data.subscription.efficientDays !== null) {
                data.timeReachedEfficientDays = new Date(...data.subscription.subscribedTime);
                data.timeReachedEfficientDays.setDate(data.subscription.efficientDays);
            }
            setPreviewScheduleData({...data});
            setRepRatio(data.subscription.repRatio);
        }
        fetchData();
    }, []);

    return <div className="preview-schedule-dialog">
        {Object.keys(previewScheduleData).length === 0
            ? <div>Loading...</div>
            : <>
                <div className="preview-schedule">
                    <h3 className="preview-block-title">{previewScheduleData.schedule.name}</h3>
                    <ul className="information">
                        <li className="basic-info">
                            Basic Info:
                            <span plain={previewScheduleData.schedule.levelEnum}>
                                {previewScheduleData.schedule.levelEnum}
                            </span>
                            <span>{previewScheduleData.subscription.aim.replaceAll("_", " ")}</span>
                            <span>Aim {previewScheduleData.subscription.weightAim}kg{previewScheduleData.subscription.aim.includes("UP") ? "+" : ""}</span>
                            <span>TDEE {previewScheduleData.tdee}Cal/Day</span>
                        </li>
                        {previewScheduleData.subscribedTimeAsDateObj !== undefined ? <li className="subscribed-time">
                            Subscribed Time:
                            {separateDateTime(previewScheduleData.subscribedTimeAsDateObj)}
                            {estimatedDateTime(previewScheduleData.timeReachedEfficientDays)}
                        </li> : <></>}
                        <li className="rep-ratio">
                            Level's Difficulty: <select name="repRatio" onChange={changeLevelsDifficulty} defaultValue={repRatio}>
                                <option value="100">Original Level (100% level)</option>
                                <option value="90">Average (90% level)</option>
                                <option value="80">Easy (80% level)</option>
                            </select>
                        </li>
                        <li>{previewScheduleData.schedule.description}</li>
                    </ul>
                    <div className="schedule-icon"><BicepsFlexed /></div>
                </div>
                <ul className="sessions-list">
                    {previewScheduleData.sessions.length === 0
                        ? <div>Loading</div>
                        : previewScheduleData.sessions.map((dataObj, index) => ItemOfListBuilder(dataObj, index, handleClickSession))
                    }
                </ul>
            </>
        }
    </div>;
}

function separateDateTime(timeAsDateObj) {
    const timeComponents = timeAsDateObj.toISOString().split(".")[0].split("T");
    timeComponents[0] = timeComponents[0].split("-").reverse().join("/");
    return <div className="separated-datetime">
        <span className="date-part">{timeComponents[0]}</span>
        <span className="time-part">{timeComponents[1]}</span>
    </div>;
}

function estimatedDateTime(timeAsDateObj) {
    const timeComponents = timeAsDateObj.toISOString().split(".")[0].split("T");
    timeComponents[0] = timeComponents[0].split("-").reverse().join("/");
    return <div className="separated-datetime">
        <span className="text-part">Estimated</span>
        <span className="date-part">{timeComponents[0]}</span>
    </div>;
}

function ItemOfListBuilder(dataObj, index, handleClickSession) {
    return <li key={"list-content_row-" + index} className="list-content_row"
        onClick={e => handleClickSession(e, dataObj)}>
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