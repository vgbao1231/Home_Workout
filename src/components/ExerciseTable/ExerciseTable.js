import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { validators } from '~/utils/validators';
import { Pencil, Trash2 } from 'lucide-react';
import Input from '../ui/Input/Input';
import MultiSelect from '../ui/MultiSelect/MultiSelect';
import Select from '../ui/Select/Select';
import Table, { TABLE_CONFIG } from '../ui/Table/Table';

function ExerciseTable() {
    console.log('exercise table');

    const exerciseData = useSelector((state) => state.exercise.exerciseData);
    const selectedExerciseRows = useSelector((state) => state.exercise.selectedRows);
    const levelData = useSelector((state) => state.level.levelData);
    const muscleData = useSelector((state) => state.muscle.muscleData);

    // Exercise columns props (or cell props in table body)

    const muscleOptions = useMemo(
        () => muscleData.map((option) => ({ value: option.id, text: option.name })),
        [muscleData],
    );

    const levelOptions = useMemo(
        () => levelData.map((option) => ({ value: option.level, text: option.name })),
        [levelData],
    );

    // Menu items for exercise table
    const contextMenuItems = [
        TABLE_CONFIG.buildMenuItem('Update Exercise', <Pencil />, TABLE_CONFIG.ROW_ACTIONS.UPDATE),
        TABLE_CONFIG.buildMenuItem('Delete Exercise', <Trash2 />, TABLE_CONFIG.ROW_ACTIONS.DELETE),
        TABLE_CONFIG.buildMenuItem('Show Exercise', <Trash2 />, null, () => {
            console.log('Show Exercise');
        }),
    ];

    const exerciseColumns = useMemo(
        () => [
            {
                name: 'name',
                text: 'Name',
                type: <Input />,
                props: {
                    validators: {
                        onBlur: [validators.isRequired],
                    },
                },
            },
            { name: 'muscle', text: 'Muscle', type: <MultiSelect />, props: { options: muscleOptions } },
            { name: 'level', text: 'Level', type: <Select />, props: { options: levelOptions } },
            { name: 'basicReps', text: 'Basic Reps', type: <Input />, props: {} },
        ],
        [muscleOptions, levelOptions],
    );

    return (
        <Table
            title="Exercise"
            columns={exerciseColumns}
            data={exerciseData}
            selectedRows={selectedExerciseRows}
            contextMenuItems={contextMenuItems}
        />
    );
}

export default ExerciseTable;
