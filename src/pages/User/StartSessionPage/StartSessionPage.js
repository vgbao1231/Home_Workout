import { useCallback, useEffect, useMemo, useState } from "react";

import { Navigate, useLocation } from "react-router-dom";
import { SubscriptionUserService } from "~/services/subscripitonService";
import Card from "./Card/Card";
import './StartSessionPage.scss'
import { ChartNoAxesColumnIncreasing, CircleCheckBig, Clock, Dumbbell, Repeat } from "lucide-react";
import noImage from '~/assets/no_image.jpg';
import { capitalizeWords } from "~/utils/formatters";

function StartSessionPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const scheduleId = queryParams.get('id');
    const ordinal = queryParams.get('ordinal');
    const [sessionData, setSessionData] = useState(); //Session data
    const [exercisesData, setExercisesData] = useState(); // All exercises of session
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0); // Current exercise index (ordinal)
    const currentExercise = exercisesData && exercisesData[currentExerciseIndex]; // Current exercise
    const [currentIteration, setCurrentIteration] = useState(1); // Current iteration (set) of current exercise
    const [isSessionStarted, setIsSessionStarted] = useState(false);
    const [isResting, setIsResting] = useState(false);
    const [totalTime, setTotalTime] = useState(0);
    const [slackTime, setSlackTime] = useState(0);
    const [exerciseTime, setExerciseTime] = useState(0);
    const progress = useMemo(() => {
        // If session is completed, set progress to 100%
        if (!isSessionStarted && currentExerciseIndex === exercisesData?.length - 1 && currentIteration === currentExercise?.iteration)
            return 100
        return (currentExerciseIndex * 100 + (currentIteration - 1) * 100 / currentExercise?.iteration) / exercisesData?.length;
    }, [currentIteration, currentExerciseIndex, exercisesData, currentExercise, isSessionStarted]);

    const checkIsHoldExercise = useCallback((exercise) => exercise?.name.toLowerCase().includes("hold"), [])

    useEffect(() => {
        if (checkIsHoldExercise(currentExercise)) {
            setExerciseTime(5);
            setExerciseTime(Math.round(currentExercise.basicReps * (1 - currentExercise.downRepsRatio * (currentIteration - 1))));
        }
    }, [checkIsHoldExercise, currentExercise, currentIteration, setExerciseTime]);

    const handleNextIteration = useCallback(() => {
        if (currentIteration < currentExercise.iteration) { // If currentIteration is not the last iteration of execise
            setIsResting(false);
            setCurrentIteration(prev => prev + 1)
        } else if (currentExerciseIndex < exercisesData.length - 1) { // If currentExerciseIndex is not the last exercises of session
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentIteration(1);
            setIsResting(false);
        } else { // End session workout
            setIsSessionStarted(false);
            alert('Complete Session Workout')
        }
    }, [currentExercise, currentIteration, exercisesData, currentExerciseIndex])

    // Handle complete current iteration and start rest mode or complete session
    const handleCompleteCurrentIteration = useCallback(() => {
        // If currentIteration is not the last exercises of session
        if (currentIteration < currentExercise.iteration) {
            setIsResting(true)
            setSlackTime(currentExercise.slackInSecond + currentExercise.raiseSlackInSecond * (currentIteration - 1)) // Slack between iteration
        }
        // If currentExerciseIndex is not the last exercises of session 
        else if (currentExerciseIndex < exercisesData.length - 1) {
            console.log(sessionData, currentExercise);

            if (currentExercise.needSwitchExerciseDelay) {
                setIsResting(true)
                setSlackTime(sessionData.switchExerciseDelay) // Slack switch exercise
            } else handleNextIteration()
        } else {
            setIsSessionStarted(false);
            alert('Complete Session Workout')
        }
    }, [currentExercise, currentIteration, currentExerciseIndex, exercisesData, handleNextIteration, sessionData])

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // useEffect for counter
    useEffect(() => {
        let timer;
        if (isSessionStarted) {
            timer = setInterval(() => {
                setTotalTime(prev => prev + 1)
                // If is resting start slack counter
                if (isResting) {
                    setSlackTime(prev => prev - 1)
                    if (slackTime <= 1) {
                        handleNextIteration()
                    }
                } else if (checkIsHoldExercise(currentExercise)) {
                    setExerciseTime(prev => prev - 1)
                    if (exerciseTime <= 1) {
                        handleCompleteCurrentIteration()
                    }
                }
            }, 1000); // Total time counter

        }
        return () => clearInterval(timer);
    }, [isSessionStarted, isResting, slackTime, handleNextIteration, handleCompleteCurrentIteration, checkIsHoldExercise, exerciseTime, currentExercise]);

    // useEffect to ask confirm before leave
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSessionStarted) {
                e.preventDefault()
                // Chrome didn't support custom message from Chrome 51
                return (e.returnValue = '');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isSessionStarted])

    // useEffect for get data
    useEffect(() => {
        const fetchData = async () => {
            const sessionResponse = await SubscriptionUserService.getSessionsOfSubscribedSchedule(scheduleId, ordinal)
            const { session, repRatio } = sessionResponse.data
            setSessionData({ repRatio, ...session });
            const exercisesResponse = await SubscriptionUserService.getExercisesInSessionOfSubscribedSchedule(session.sessionId)
            setExercisesData(exercisesResponse.data.map(({ exercise, ...rest }) => ({
                ...rest,
                ...exercise,
                basicReps: Math.ceil(exercise.basicReps * repRatio / 100)
            })));
        }
        fetchData()

    }, [scheduleId, ordinal]);

    console.log(sessionData);

    // If there is no param in param url then redirect to homepage
    return !scheduleId ?
        (<Navigate to="/" />)
        :
        (!sessionData || !exercisesData) ?
            (<div>Loading... </div>)
            :
            (
                <div className="start-session">
                    <div className="session-title center">{sessionData.name}</div>
                    <div className="cards-wrapper">
                        <Card title='Session Information' className='session-information'>
                            <div className="card-element">
                                <span><ChartNoAxesColumnIncreasing /></span>
                                <span>Session Level: </span>
                                <span className="session-level">{capitalizeWords(sessionData.levelEnum)}</span>
                            </div>
                            <div className="card-element flex-col">
                                <span>Target Muscle Groups: </span>
                                <div className="muscle-list">
                                    {sessionData.muscles?.map(muscle => <div key={muscle.muscleId} className="muscle">{muscle.muscleName}</div>)}
                                </div>
                            </div>
                            <div className="card-element flex-col">
                                <div className="progress-box">
                                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                                </div>
                                <span className="progress-percent">{Math.round(progress)}% completed</span>
                            </div>
                            <div className="card-element flex-col">
                                <span>Total Time: </span>
                                <span className="total-time">{formatTime(totalTime)}</span>
                            </div>
                        </Card>

                        <Card title={`Current Exercise: ${currentExercise ? currentExercise.name : ''}`} className='current-exercise'>
                            <div className="image-container center">
                                <img src={currentExercise.imageUrl || noImage} alt="no-image" className="current-image" />
                            </div>
                            <div className="current-exercise-info-wrapper">
                                <div className="current-exercise-info">
                                    <div className="card-element">
                                        <Dumbbell />
                                        <div className="info-wrapper">
                                            <span>Target Muscle Groups: </span>
                                            <div className="muscle-list">
                                                {currentExercise?.muscles.map(muscle => <div key={muscle.muscleId} className="muscle">{muscle.muscleName}</div>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-element">
                                        <Repeat />
                                        <div className="info-wrapper">
                                            <span>{checkIsHoldExercise(currentExercise) ? "Time: " : "Reps: "}</span>
                                            <span className="repetitions">{Math.ceil(currentExercise.basicReps * (1 - currentExercise.downRepsRatio * (currentIteration - 1)))}</span>
                                        </div>
                                    </div>
                                    <div className="card-element">
                                        <Clock />
                                        <div className="info-wrapper">
                                            <span>Iterations: </span>
                                            <span className="iteration">{currentExercise?.iteration}</span>
                                        </div>
                                    </div>
                                    <div className="card-element">
                                        <CircleCheckBig />
                                        <div className="info-wrapper">
                                            <span>Current Iteration: </span>
                                            <span className="repetitions">{`${currentIteration}/${currentExercise?.iteration}`}</span>
                                        </div>
                                    </div>
                                </div>
                                {isResting ?
                                    <div className="slack-time center">Rest Time: {formatTime(slackTime)}</div>
                                    :
                                    (checkIsHoldExercise(currentExercise) && <div className="exercise-time center">Hold Time: {formatTime(exerciseTime)}</div>)
                                }
                                {isSessionStarted ?
                                    (isResting ?
                                        <button className="current-exercise-btn" onClick={handleNextIteration}>Next</button>
                                        :
                                        (!checkIsHoldExercise(currentExercise) &&
                                            <button className="current-exercise-btn complete" onClick={handleCompleteCurrentIteration}>Complete</button>)
                                    )
                                    : <button className="current-exercise-btn" onClick={() => setIsSessionStarted(true)}>Start Session</button>}
                            </div>
                        </Card>
                    </div>

                    <Card title='Exercise List' className='exercise-list'>
                        {exercisesData.map((exercise, index) =>
                            <Card key={index} title={exercise.name}
                                className={`exercise-of-session ${currentExerciseIndex === index ? 'active' : ''}`}
                                isCompleted={currentExerciseIndex > index}
                            >
                                <div className="image-container">
                                    <img src={exercise.imageUrl || noImage} alt="no-image" className="current-image" />
                                </div>
                                <div className="card-info-wrapper">
                                    <div className="card-element">
                                        <span>Muscles: </span>
                                        <span>{exercise.muscles.map(muscle => muscle.muscleName).join(', ')}</span>
                                    </div>
                                    <div className="card-element">
                                        <span>{checkIsHoldExercise(exercise) ? "Time: " : "Reps: "}</span>
                                        <span className="repetitions">{exercise.basicReps}{checkIsHoldExercise(exercise) ? 's' : ''}</span>
                                    </div>
                                    <div className="card-element">
                                        <span>Iterations: </span>
                                        <span className="iteration">{exercise.iteration}</span>
                                    </div>
                                    <div className="card-element">
                                        <span>Slack: </span>
                                        <span className="iteration">{exercise.slackInSecond}s</span>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </Card>
                </div>

            );
}

export default StartSessionPage;