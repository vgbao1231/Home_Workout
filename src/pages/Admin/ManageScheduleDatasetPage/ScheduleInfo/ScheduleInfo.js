import { useEffect, useState } from 'react';
import './ScheduleInfo.scss';
import { BicepsFlexed } from 'lucide-react';
import { ScheduleAdminService } from '~/services/scheduleService';
import { checkIsBlank } from '~/utils/formatters';

export default function ScheduleInfo({ schedule_id }) {
    const [ previewScheduleData, setPreviewScheduleData ] = useState({});

    useEffect(() => {
        !checkIsBlank(schedule_id) && ScheduleAdminService.getPreviewScheduleInfo(schedule_id)
            .then(response => {
                const data = response.data;
                data.totalSessions = response.data.sessionsOfSchedules.length;
                data.totalExercises = new Set(data.sessionsOfSchedules
                    .reduce((a,sos) =>
                        [...a, ...sos.exercisesOfSessions.map(eos => eos.exercise.exerciseId)]
                    , [])
                ).size;
                setPreviewScheduleData(data);
            }).catch(error => setPreviewScheduleData({}));
    }, [schedule_id]);

    return (Object.keys(previewScheduleData).length === 0
        ? <div className="preview-schedule-info">
            <h2>Select datalines to see Schedule Information</h2>
        </div>
        : <div className="preview-schedule-info">
            <div className="title">Preview Schedule <span className="schedule-id">{schedule_id}</span></div>
            <div className="content-block">
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
                    {previewScheduleData.sessionsOfSchedules.map((sessionOfSchedule, i) => (
                        <div key={"preivew-session-" + i} className="preview-session">
                            <div className="information">
                                <div className="left-tag">
                                    <span className="session-name">
                                        <span className="session-ordinal">{sessionOfSchedule.ordinal}</span>
                                        {sessionOfSchedule.session.name}
                                    </span>
                                    <span className="session-description">{sessionOfSchedule.session.description}</span>
                                </div>
                                <span className="right-tag">
                                    <span className="session-level" plain={sessionOfSchedule.session.levelEnum}>
                                        {sessionOfSchedule.session.levelEnum}
                                    </span>
                                    <span className="session-muscles">
                                        {sessionOfSchedule.session.muscles.map(m => m.muscleName).join(" - ")}
                                    </span>
                                </span>
                            </div>
                            <div className="exercises">
                                {sessionOfSchedule.exercisesOfSessions.map((exerciseOfSession, j) =>
                                    <div key={i + "-preview-exericse-" + j} className="exercise-name">
                                        <span className="index">{exerciseOfSession.ordinal}</span>
                                        <span className="value">
                                            {exerciseOfSession.exercise.name}
                                            <b> ({exerciseOfSession.iteration} Sets)</b>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}