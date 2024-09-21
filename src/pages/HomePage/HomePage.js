import { Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

    // Handle log out
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

    const [editableRow, setEditableRow] = useState(null); // Row that can be edited
    const muscleOptions = useMemo(
        () => muscleData.map((option) => ({ value: option.id, text: option.name })),
        [muscleData],
    );

    const levelOptions = useMemo(
        () => levelData.map((option) => ({ value: option.level, text: option.name })),
        [levelData],
    );

    /* ============================== GENERATE EXCERCISE TABLE ============================== */
    // Excercise columns props (or cell props in table body)
    const excerciseColumns = useMemo(
        () => [
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
        [muscleOptions, levelOptions],
    );

    // Menu items for excercise table
    const contextMenuItems = useCallback(
        (row) => [
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
        [],
    );

    useEffect(() => {
        dispatch(fetchMuscleData());
        dispatch(fetchLevelData());
        dispatch(fetchExcerciseData());
    }, [dispatch]);

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
            <Table
                title="Excercise"
                columns={excerciseColumns}
                data={excerciseData}
                selectedRows={selectedExcerciseRows}
                editableRow={editableRow}
                setEditableRow={setEditableRow}
                contextMenuItems={contextMenuItems}
            />
        </div>
    );
};

export default HomePage;
