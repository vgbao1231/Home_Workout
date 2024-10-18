import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './AddSessionDialog.scss';
import { exerciseActions } from '~/redux/slices/exerciseSlice';

function AddSessionDialog({ sessionData, setIsAddingSession, onClose }) {
    console.log('dialog');

    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.muscleId, text: muscle.muscleName }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))
    const { ...selectedExerciseState } = exerciseState
    selectedExerciseState.data = useMemo(() => exerciseState.data.filter((row) => exerciseState.selectedRows[row.exerciseId]), [exerciseState]);

    const columns = useMemo(
        () => [
            { header: 'Name', name: 'name', cell: row => <Input name="name" />, editable: false },
            { header: 'Muscle List', name: 'musclesList', cell: row => <MultiSelect name="musclesList" options={muscleOptions} />, editable: false },
            { header: 'Level', name: 'levelEnum', cell: row => <Select name="levelEnum" options={levelOptions} />, editable: false },
            { header: 'Basic Reps', name: 'basicReps', cell: row => <Input name="basicReps" type="number" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" defaultValue='0' /> },
            { header: 'Down Reps Ratio', name: 'downRepsRatio', cell: row => <Input name="downRepsRatio" type="number" defaultValue='0' /> },
            { header: 'Slack In Second', name: 'slackInSecond', cell: row => <Input name="slackInSecond" type="number" defaultValue='0' /> },
            { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', cell: row => <Input name="raiseSlackInSecond" type="number" defaultValue='0' /> },
            { header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', cell: row => <Input name="needSwitchExerciseDelay" type="number" defaultValue='0' /> },
        ],
        [muscleOptions, levelOptions],
    );

    // Create data for the dialog box with fields such as ordinal, downRepsRatio,...
    const dialogData = useMemo(() =>
        selectedExerciseState.data.map(rowData => columns.reduce((acc, column) => {
            if (column.editable !== false) acc[column.name] = column.cell().props.defaultValue
            return acc
        }, { exerciseId: rowData.exerciseId })
        ), [columns, selectedExerciseState.data]
    )
    const [dialogTableData, setDialogTableData] = useState(dialogData)

    const rowProps = useCallback((rowData) => {
        const handleRowChange = (e) => {
            const { name, value } = e.target
            setDialogTableData(prev => prev.map(dialogRowData =>
                dialogRowData.exerciseId === rowData.exerciseId ?
                    { ...dialogRowData, [name]: value } : dialogRowData
            ))
        }
        return {
            onChange: handleRowChange
        }
    }, [])

    console.log(dialogTableData);

    const handleSubmit = () => {
        console.log(sessionData, dialogTableData);
        onClose()
        setIsAddingSession(false)
    }

    return (
        <>
            <Table
                title="Selected Exercise"
                columns={columns}
                tableStates={selectedExerciseState}
                tableReducers={exerciseActions}
                rowProps={rowProps}
                tableModes={{ enableEdit: true }}
            />
            <button onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default AddSessionDialog;
