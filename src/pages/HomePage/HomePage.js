import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, MultiSelect, Select, Table } from '~/components';
import { logoutThunk } from '~/store/authSlice';
import { fetchExcerciseData } from '~/store/excerciseSlice';
import { fetchLevelData } from '~/store/levelSlice';
import { fetchMuscleData } from '~/store/muscleSlice';
import { addToast } from '~/store/toastSlice';
import { validators } from '~/utils/validators';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const excerciseData = useSelector((state) => state.excercise.excerciseData);
    const levelData = useSelector((state) => state.level.levelData);
    const muscleData = useSelector((state) => state.muscle.muscleData);
    const selectedExcerciseRows = useSelector((state) => state.excercise.selectedRows);

    console.log('home');

    const handleLogout = async () => {
        dispatch(logoutThunk()).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/login');
                dispatch(addToast(result.payload.message, 'success'));
            } else {
                dispatch(addToast(result.payload.message, 'error'));
            }
        });
    };

    const [editableRow, setEditableRow] = useState(null);
    const excerciseTableProps = useMemo(() => {
        const muscleOptions = muscleData.map((option) => ({ value: option.id, text: option.name }));
        const levelOptions = levelData.map((option) => ({ value: option.level, text: option.name }));
        return {
            title: 'Excercise',
            columns: [
                {
                    name: 'name',
                    text: 'Name',
                    type: <Input />,
                    props: { validators: [validators.isRequired('onChange')] },
                },
                { name: 'muscle', text: 'Muscle', type: <MultiSelect />, props: { options: muscleOptions } },
                { name: 'level', text: 'Level', type: <Select />, props: { options: levelOptions } },
                { name: 'basicReps', text: 'Basic Reps', type: <Input />, props: {} },
            ],
            data: excerciseData || [],
            selectedRows: selectedExcerciseRows,
            editableRow: editableRow,
            setEditableRow: setEditableRow,
            contextMenuItems: (row) => [
                {
                    text: 'Update Exercise',
                    icon: <Pencil />,
                    onClick: () => setEditableRow(row.id),
                },
                {
                    text: 'Delete Exercise',
                    icon: <Trash2 />,
                    onClick: () => console.log('Delete Row: ' + row.id),
                },
            ],
        };
    }, [editableRow, excerciseData, levelData, muscleData, selectedExcerciseRows]);

    useEffect(() => {
        dispatch(fetchMuscleData());
        dispatch(fetchLevelData());
        dispatch(fetchExcerciseData());
    }, [dispatch]);

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
            <Table {...excerciseTableProps} />
        </div>
    );
};

export default HomePage;
