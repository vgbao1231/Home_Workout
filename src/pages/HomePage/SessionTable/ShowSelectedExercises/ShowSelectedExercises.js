import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './ShowSelectedExercises.scss';

function ShowSelectedExercises({ sessionData }) {
    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);

    const exerciseHeaders = useMemo(
        () => [
            { header: 'Name', name: 'name', buildField: rowData => <Input name="name" disabled /> },
            {
                header: 'Muscle List', name: 'muscleList', buildField: rowData => <MultiSelect name="muscleList" options={muscleData.map(muscle => (
                    { text: muscle["name"], value: muscle["id"] }
                ))} />
            },
            {
                header: 'Level', name: 'levelEnum', buildField: rowData => <Select name="levelEnum" options={levelData.map(dataObj => ({
                    value: dataObj["level"], text: dataObj["name"]
                }))} />
            },
            { header: 'Basic Reps', name: 'basicReps', buildField: rowData => <Input name="basicReps" type="number" /> },
            { header: 'Ordinal', name: 'ordinal', buildField: rowData => <Input name="ordinal" type="number" /> },
            { header: 'Down Reps Ratio', name: 'downRepsRatio', buildField: rowData => <Input name="downRepsRatio" type="number" /> },
            { header: 'Slack In Second', name: 'slackInSecond', buildField: rowData => <Input name="slackInSecond" type="number" /> },
            { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', buildField: rowData => <Input name="raiseSlackInSecond" type="number" /> },
            { header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', buildField: rowData => <Input name="needSwitchExerciseDelay" type="number" /> },
        ],
        [muscleData, levelData],
    );

    const sessionRowProps = useMemo(() => {
        return {
            tableState: exerciseState,
            canSelectingRow: false,
            columns: [
                { header: 'Name', name: 'name' },
                {
                    header: 'Muscle List', name: 'muscleList', buildField: rowData => <MultiSelect name="muscleList" options={muscleData.map(muscle => (
                        { text: muscle["name"], value: muscle["id"] }
                    ))} />
                },
                { header: 'Level', name: 'levelEnum' },
                { header: 'Basic Reps', name: 'basicReps' },
                { header: 'Ordinal', name: 'ordinal', buildField: rowData => <Input name="ordinal" type="number" /> },
                { header: 'Down Reps Ratio', name: 'downRepsRatio', buildField: rowData => <Input name="downRepsRatio" type="number" /> },
                { header: 'Slack In Second', name: 'slackInSecond', buildField: rowData => <Input name="slackInSecond" type="number" /> },
                { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', buildField: rowData => <Input name="raiseSlackInSecond" type="number" /> },
                { header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', buildField: rowData => <Input name="needSwitchExerciseDelay" type="number" /> },
            ],
        };
    }, [muscleData, exerciseState]);

    const selectedData = exerciseState.data.filter((row) => exerciseState.selectedRows[row.exerciseId]);

    return (
        <Table
            title="Selected Exercise"
            headers={exerciseHeaders}
            data={selectedData}
            selectedRows={exerciseState.selectedRows}
            primaryKey={exerciseState.primaryKey}
            rowProps={sessionRowProps}
        />
    );
}

export default ShowSelectedExercises;
