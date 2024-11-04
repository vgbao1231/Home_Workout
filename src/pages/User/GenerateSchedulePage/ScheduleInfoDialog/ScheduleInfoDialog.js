import { useCallback, useEffect, useState } from 'react';
import './ScheduleInfoDialog.scss';
import { SubscriptionUserService } from '~/services/subscripitonService';
import { BicepsFlexed } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import { useNavigate } from 'react-router-dom';

export default function ScheduleInfoDialog({ data, scheduleId }) {
    const dispatch = useDispatch();
    const [previewScheduleData, setPreviewScheduleData] = useState({});
    const [wasSubscribed, setWasSubscribed] = useState()
    const navigate = useNavigate()

    useEffect(() => {
        SubscriptionUserService.getPreviewScheduleInfoForUserToSubscribe(scheduleId)
            .then(response => {
                const data = response.data;
                data.totalExercises = new Set(
                    response.data.sessionsOfSchedules.reduce((acc, previewSession) => [...acc, ...previewSession.exerciseNames], [])
                ).size;
                console.log(data);
                setWasSubscribed(data.wasSubscribed)
                setPreviewScheduleData(data);
            })
            .catch(error => setPreviewScheduleData({}));
    }, [scheduleId]);

    const handleClickSubscribe = useCallback(() => {
        if (!window.confirm("Confirm this subscription?")) return;
        const formData = {
            aimType: data.aim,
            repRatio: data.repRatio,
            weight: Number.parseFloat(data.weight),
            scheduleId,
            bodyFat: data.bodyFat,
            aimRatio: data.aimRatio === '' ? null : data.aimRatio,
            weightAimByDiet: Number.parseFloat(data.weightAimByDiet),
        };
        SubscriptionUserService.subscribeScheduleWithAI(formData)
            .then(response => {
                dispatch(addToast(response.message, "success"));
                navigate('/')
            })
            .catch(error => dispatch(addToast(error.message, "error")));
    }, [data, scheduleId, dispatch]);

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
            {wasSubscribed ?
                <button className='disabled-btn' disabled={wasSubscribed}>Already Subscribed</button> :
                <button className='btn' onClick={handleClickSubscribe}>Subscribe</button>}
        </div>
    );
}