import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import { toggleSelectRow } from '~/redux/slices/exerciseSlice';
import './ShowSelectedExercises.scss';

function ShowSelectedExercises() {
    const dispatch = useDispatch();
    const { data, selectedRows, primaryKey } = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.level.levelData);
    const muscleData = useSelector((state) => state.muscle.muscleData);

    const exerciseColumns = useMemo(
        () => [
            { header: 'Name', field: <Input name="name" disabled /> },
            { header: 'Muscle List', field: <MultiSelect name="muscleList" options={muscleData} /> },
            { header: 'Level', field: <Select name="levelEnum" options={levelData} /> },
            { header: 'Basic Reps', field: <Input name="basicReps" type="number" /> },
            { header: 'Ordinal', field: <Input name="ordinal" type="number" /> },
            { header: 'Down Reps Ratio', field: <Input name="downRepsRatio" type="number" /> },
            { header: 'Slack In Second', field: <Input name="slackInSecond" type="number" /> },
            { header: 'Raise Slack In Second', field: <Input name="raiseSlackInSecond" type="number" /> },
            { header: 'Need Switch Exercise Delay', field: <Input name="needSwitchExerciseDelay" type="number" /> },
        ],
        [muscleData, levelData],
    );

    const sessionRowProps = (rowData) => {
        //Handle click row
        const handleClick = () => {
            // dispatch(toggleSelectRow(rowData.exerciseId));
        };

        return {
            rowData,
            isUpdating: true,
            columns: exerciseColumns,
            isSelected: selectedRows[rowData.exerciseId],
            onClick: handleClick,
        };
    };

    const selectedData = data.filter((row) => selectedRows[row.exerciseId]);

    console.log(selectedData);

    return (
        <>
            <Table
                columns={exerciseColumns}
                data={selectedData}
                selectedRows={selectedRows}
                primaryKey={primaryKey}
                rowProps={sessionRowProps}
            />
        </>
    );
}

export default ShowSelectedExercises;
