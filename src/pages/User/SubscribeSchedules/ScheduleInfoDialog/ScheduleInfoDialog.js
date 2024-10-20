import { useCallback, useEffect, useState } from 'react';
import './ScheduleInfoDialog.scss';
import { SubscriptionUserService } from '~/services/subscripitonService';
import { BicepsFlexed } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import { EnumUserService } from '~/services/enumService';

export default function ScheduleInfoDialog({ scheduleId }) {
    const dispatch = useDispatch();
    const [ previewScheduleData, setPreviewScheduleData ] = useState({});
    const [ aimsData, setAimsData ] = useState([]);

    useEffect(() => {
        SubscriptionUserService.getPreviewScheduleInfoForUserToSubscribe(scheduleId)
            .then(response => {
                const data = response.data;
                data.totalExercises = new Set(
                    response.data.sessionsOfSchedules.reduce((acc, previewSession) => [...acc, ...previewSession.exerciseNames], [])
                ).size;
                setPreviewScheduleData(data);
            })
            .catch(error => setPreviewScheduleData({}));

        EnumUserService.getAllAimsEnum()
            .then(response => setAimsData(response.data))
            .catch(error => setAimsData([]));
    }, []);

    const handleClickSubscribe = useCallback(e => {
        e.preventDefault();
        if (!window.confirm("Confirm this subscription?"))  return;
        const formData = {
            aimLevel: Number.parseInt(e.target.querySelector("select[name=aimLevel]").value),
            repRatio: Number.parseInt(e.target.querySelector("select[name=repRatio]").value),
            height: Number.parseFloat(e.target.querySelector("input[name=height]").value),
            weight: Number.parseInt(e.target.querySelector("input[name=weight]").value),
            scheduleId
        };
        console.log(formData);
        SubscriptionUserService.subscribeSchedule(formData)
            .then(response => {
                dispatch(addToast(response.message, "success"));
                document.location.reload();
            })
            .catch(error => dispatch(addToast(error.message, "error")));
    }, []);

    return (Object.keys(previewScheduleData).length === 0
        ? <div>Loading...</div>
        : <div className="preview-schedule-to-subscribe">
            <div className="preview-schedule">
                <h3 className="preview-block-title">{previewScheduleData.schedule.name}</h3>
                <ul className="information">
                    <li className="schedule-level">
                        Level: <span plain={previewScheduleData.schedule.levelEnum}>
                            {previewScheduleData.schedule.levelEnum}
                        </span>
                    </li>
                    <li className="coins">
                        Coins: <span>{previewScheduleData.schedule.coins}$</span>
                    </li>
                    <li className="total-sessions">
                        Total Sessions: <span>{previewScheduleData.totalSessions}/week</span>
                    </li>
                    <li className="total-exercises">
                        Total Exercises: <span>{previewScheduleData.totalExercises}/schedule</span>
                    </li>
                    <li>{previewScheduleData.schedule.description}</li>
                </ul>
                <div className="schedule-icon"><BicepsFlexed /></div>
            </div>
            <div className="preview-all-sessions">
                <h3 className="preview-block-title">Sessions Information</h3>
                {previewScheduleData.sessionsOfSchedules.map((previewSession, index) => (
                    <div key={"preivew-session-" + index} className="preview-session">
                        <div className="information">
                            <div className="left-tag">
                                <span className="session-name">{previewSession.session.name}</span>
                                <span className="session-description">{previewSession.session.description}</span>
                            </div>
                            <span className="right-tag">
                                <span className="session-level" plain={previewSession.session.levelEnum}>
                                    {previewSession.session.levelEnum}
                                </span>
                                <span className="session-muscles">
                                    {previewSession.session.muscles.map(m => m.muscleName).join(" - ")}
                                </span>
                            </span>
                        </div>
                        <div className="exercises">
                            {previewSession.exerciseNames.map((name, index) =>
                                <div key={"preview-exericse-" + index} className="exercise-name">
                                    <span className="index">{index + 1}</span>
                                    <span className="value">{name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="subscribe-block">
                <form onSubmit={e => handleClickSubscribe(e)}>
                    <fieldset>
                        <legend>Level's Difficulty</legend>
                        <select name="aimLevel">
                            {aimsData.map((aim, index) =>
                                <option key={"aim-select-" + index} value={aim.level}>{aim.name}</option>
                            )}
                        </select>
                    </fieldset>
                    <fieldset>
                        <legend>Level's Difficulty</legend>
                        <select name="repRatio">
                            <option value="3">Original Level (100% level)</option>
                            <option value="2">Average (90% level)</option>
                            <option value="1">Easy (80% level)</option>
                        </select>
                    </fieldset>
                    <fieldset>
                        <legend>Height (cm)</legend>
                        <input name="height" type="float" required min="1" max="300" autoComplete="off"/>
                    </fieldset>
                    <fieldset>
                        <legend>Weight (kg)</legend>
                        <input name="weight" type="float" required min="1" max="300" autoComplete="off"/>
                    </fieldset>
                    <div className="subscribe-btn">
                        <button type="submit">Subscribe</button>
                    </div>
                </form>
            </div>
        </div>
    );
}