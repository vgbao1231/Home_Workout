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
    const exerciseState = useSelector((state) => state.exercise);
    const sessionState = useSelector((state) => state.session);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);

    const exerciseHeaders = useMemo(
        () => [
            { header: 'Name', buildField: rowData => <Input name="name" disabled /> },
            { header: 'Muscle List', buildField: rowData => <MultiSelect name="muscleList" options={muscleData} /> },
            { header: 'Level', buildField: rowData => <Select name="levelEnum" options={levelData} /> },
            { header: 'Basic Reps', buildField: rowData => <Input name="basicReps" type="number" /> },
            { header: 'Ordinal', buildField: rowData => <Input name="ordinal" type="number" /> },
            { header: 'Down Reps Ratio', buildField: rowData => <Input name="downRepsRatio" type="number" /> },
            { header: 'Slack In Second', buildField: rowData => <Input name="slackInSecond" type="number" /> },
            { header: 'Raise Slack In Second', buildField: rowData => <Input name="raiseSlackInSecond" type="number" /> },
            { header: 'Need Switch Exercise Delay', buildField: rowData => <Input name="needSwitchExerciseDelay" type="number" /> },
        ],
        [muscleData, levelData],
    );

    const sessionRowProps = useMemo(() => {
        return {
            tableState: sessionState,
            columns: [
                { header: 'Name', buildField: rowData => <Input name="name" disabled /> },
                { header: 'Muscle List', buildField: rowData => <MultiSelect name="muscleList" options={muscleData} /> },
                { header: 'Level', buildField: rowData => <Select name="levelEnum" options={levelData} /> },
                { header: 'Basic Reps', buildField: rowData => <Input name="basicReps" type="number" /> },
                { header: 'Ordinal', buildField: rowData => <Input name="ordinal" type="number" /> },
                { header: 'Down Reps Ratio', buildField: rowData => <Input name="downRepsRatio" type="number" /> },
                { header: 'Slack In Second', buildField: rowData => <Input name="slackInSecond" type="number" /> },
                { header: 'Raise Slack In Second', buildField: rowData => <Input name="raiseSlackInSecond" type="number" /> },
                { header: 'Need Switch Exercise Delay', buildField: rowData => <Input name="needSwitchExerciseDelay" type="number" /> },
            ],
        };
    }, [dispatch, levelData, muscleData, sessionState]);


    return (
        <Table
            title="Selected Exercise"
            headers={exerciseHeaders}
            state={exerciseState}
            rowProps={sessionRowProps}
        />
    );
}

export default ShowSelectedExercises;
