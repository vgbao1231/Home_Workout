import { useEffect, useState } from "react";

import { Navigate, useLocation } from "react-router-dom";
import { SubscriptionUserService } from "~/services/subscripitonService";
import Card from "./Card/Card";
import './StartSessionPage.scss'
import { CircleCheckBig, Clock, Dumbbell, Repeat } from "lucide-react";

function StartSessionPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('id');
    const [sessionData, setSessionData] = useState({});
    const [exercisesData, setExercisesData] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentIteration, setCurrentIteration] = useState(1);


    useEffect(() => {
        const fetchData = async () => {
            const sessionResponse = await SubscriptionUserService.getSessionsOfSubscribedSchedule(sessionId)
            const exercisesResponse = await SubscriptionUserService.getExercisesInSessionOfSubscribedSchedule(sessionId)
            setSessionData(sessionResponse.data);
            setExercisesData(exercisesResponse.data);
        }
        fetchData()

    }, [sessionId]);

    console.log(sessionData);
    console.log(exercisesData);

    // If there is no param in param url then redirect to homepage
    return !sessionId ?
        <Navigate to="/" /> :
        (
            <div className="start-session">
                Start Session
                <div className="cards-wrapper">
                    <Card title='Session Information' className='session-information'>
                        <div className="card-element flex-col">
                            <span>Target Muscle Groups: </span>
                            <div className="muscle-list">
                                {sessionData.muscles?.map(muscle => <div key={muscle.muscleId} className="muscle">{muscle.muscleName}</div>)}
                            </div>
                        </div>
                        {/* <div className="card-element flex-col">
                        <span>Overall Progress: </span>
                        <div className="overall-progress"></div>
                    </div> */}
                        <div className="card-element flex-col">
                            <span>Total Time: </span>
                            <div>00:32</div>
                        </div>
                    </Card>

                    <Card title={`Current Exercise: ${exercisesData[currentExerciseIndex]?.name}`} className='current-exercise'>
                        <div className="card-element">
                            <Dumbbell />
                            <div className="info-wrapper">
                                <span>Target Muscle Groups: </span>
                                <div className="muscle-list">
                                    {sessionData.muscles?.map(muscle => <div key={muscle.muscleId} className="muscle">{muscle.muscleName}</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="card-element">
                            <Repeat />
                            <div className="info-wrapper">
                                <span>Repetitions: </span>
                                <div className="repetitions">{exercisesData[currentExerciseIndex]?.basicReps}</div>
                            </div>
                        </div>
                        <div className="card-element">
                            <Clock />
                            <div className="info-wrapper">
                                <span>Iteration: </span>
                                <div className="iteration">{exercisesData[currentExerciseIndex]?.iteration}</div>
                            </div>
                        </div>
                        <div className="card-element">
                            <CircleCheckBig />
                            <div className="info-wrapper">
                                <span>Current Iteration: </span>
                                <div className="repetitions">{`${currentIteration}/${exercisesData[currentExerciseIndex]?.iteration}`}</div>
                            </div>
                        </div>

                    </Card>
                </div>
            </div>

        );
}

export default StartSessionPage;