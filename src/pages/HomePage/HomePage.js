import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, MultiSelect, Select, Table } from '~/components';
import { getAllExcercises, getAllLevels, getAllMuscles } from '~/services/excerciseService';
import { logoutThunk } from '~/store/authSlice';
import { getInitialData } from '~/store/excerciseSlice';
import { addToast } from '~/store/toastSlice';
import { validators } from '~/utils/validators';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [muscleOptions, setMuscleOptions] = useState([]);
    const [levelOptions, setLevelOptions] = useState([]);

    const handleLogout = async () => {
        dispatch(logoutThunk()).then((result) => {
            console.log(result);
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
    };

    const excerciseColumns = useMemo(() => {
        return [
            { name: 'name', text: 'Name', type: <Input />, props: { validators: [validators.isRequired('onChange')] } },
            { name: 'muscle', text: 'Muscle', type: <MultiSelect />, props: { options: muscleOptions } },
            { name: 'level', text: 'Level', type: <Select />, props: { options: levelOptions } },
            { name: 'basicReps', text: 'Basic Reps', type: <Input />, props: {} },
        ];
    }, [muscleOptions, levelOptions]);

    useEffect(() => {
        const fetchData = async () => {
            const excerciseData = await getAllExcercises();
            const levelData = await getAllLevels();
            const muscleData = await getAllMuscles();

            dispatch(getInitialData(excerciseData));
            setLevelOptions(levelData.map((option) => ({ value: option.level, text: option.name })));
            setMuscleOptions(muscleData.map((option) => ({ value: option.id, text: option.name })));
        };
        fetchData();
    }, [dispatch]);

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
            <Table columns={excerciseColumns} />
        </div>
    );
};

export default HomePage;
