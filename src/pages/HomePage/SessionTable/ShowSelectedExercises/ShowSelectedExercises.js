import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './ShowSelectedExercises.scss';
import { exerciseActions } from '~/redux/slices/exerciseSlice';

function ShowSelectedExercises({ sessionData }) {
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.id, text: muscle.name }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))

    const columns = useMemo(
        () => [
            { header: 'Name', name: 'name', cell: row => <Input name="name" />, editable: false },
            { header: 'Muscle List', name: 'muscleList', cell: row => <MultiSelect name="muscleList" options={muscleOptions} />, editable: false },
            { header: 'Level', name: 'levelEnum', cell: row => <Select name="levelEnum" options={levelOptions} />, editable: false },
            { header: 'Basic Reps', name: 'basicReps', cell: row => <Input name="basicReps" type="number" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" /> },
            { header: 'Down Reps Ratio', name: 'downRepsRatio', cell: row => <Input name="downRepsRatio" type="number" /> },
            { header: 'Slack In Second', name: 'slackInSecond', cell: row => <Input name="slackInSecond" type="number" /> },
            { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', cell: row => <Input name="raiseSlackInSecond" type="number" /> },
            { header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', cell: row => <Input name="needSwitchExerciseDelay" type="number" /> },
        ],
        [muscleOptions, levelOptions],
    );

    const rowProps = useCallback((rowData) => {
        return {
            rowData,
        };
    }, [])

    const { ...selectedExerciseState } = exerciseState
    selectedExerciseState.data = useMemo(() => exerciseState.data.filter((row) => exerciseState.selectedRows[row.exerciseId]), []);

    return (
        <Table
            title="Selected Exercise"
            columns={columns}
            tableStates={selectedExerciseState}
            tableReducers={exerciseActions}
            rowProps={rowProps}
            tableModes={{ enableFilter: true, enableSort: true, enableSelect: true, enableEdit: true }}
        />
    );
}

export default ShowSelectedExercises;
