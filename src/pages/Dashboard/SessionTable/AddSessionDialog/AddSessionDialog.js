import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './AddSessionDialog.scss';
import AddExercisesOfSessionDialog from '../AddExercisesOfSessionDialog/AddExercisesOfSessionDialog';
import { Dialog } from '~/components';
import { Trash2 } from 'lucide-react';

function AddSessionDialog({ sessionData, setIsAddingSession, onClose }) {
    console.log('dialog');

    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.muscleId, text: muscle.muscleName }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))

    const [isAddingRow, setIsAddingRow] = useState(false);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
    const { ...selectedExerciseState } = exerciseState
    selectedExerciseState.data = useMemo(() => exerciseState.data.filter((row) => exerciseState.selectedRows[row.exerciseId]), [exerciseState]);

    const columns = useMemo(
        () => [
            { header: 'Name', name: 'name', cell: row => <Input name="name" />, editable: false },
            { header: 'Muscle List', name: 'musclesList', cell: row => <MultiSelect name="musclesList" options={muscleOptions} />, editable: false },
            { header: 'Level', name: 'levelEnum', cell: row => <Select name="levelEnum" options={levelOptions} />, editable: false },
            { header: 'Basic Reps', name: 'basicReps', cell: row => <Input name="basicReps" type="number" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" />, defaultValue: 0 },
            { header: 'Down Reps Ratio', name: 'downRepsRatio', cell: row => <Input name="downRepsRatio" type="number" />, defaultValue: 0 },
            { header: 'Slack In Second', name: 'slackInSecond', cell: row => <Input name="slackInSecond" type="number" />, defaultValue: 0 },
            { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', cell: row => <Input name="raiseSlackInSecond" type="number" />, defaultValue: 0 },
            { header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', cell: row => <Input name="needSwitchExerciseDelay" type="number" />, defaultValue: 0 },
            { header: 'Action', cell: row => <Trash2 onClick={() => setTableData(prev => prev.filter(rowData => rowData.id !== row.id))} /> },
        ],
        [muscleOptions, levelOptions],
    );

    // Create data for the dialog box with fields such as ordinal, downRepsRatio,...
    const initialTableData = useMemo(() =>
        selectedExerciseState.data.map(rowData =>
            columns.reduce((acc, column) => {
                if (!acc[column.name]) acc[column.name] = column.defaultValue
                return acc
            }, { ...rowData })
        ), [columns, selectedExerciseState.data]
    )

    console.log(initialTableData);

    const [tableData, setTableData] = useState(initialTableData)

    const rowProps = useCallback((rowData) => {
        const handleRowChange = (e) => {
            const { name, value } = e.target
            setTableData(prev => prev.map(row =>
                row.exerciseId === rowData.exerciseId ?
                    { ...row, [name]: value } : row
            ))
        }
        return {
            onChange: handleRowChange
        }
    }, [])

    const addRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            customAddForm: () => {
                setDialogProps({
                    isOpen: true,
                    body: <AddExercisesOfSessionDialog columns={columns} setTableData={setTableData} />,
                })
            },
        };
    }, [isAddingRow, setIsAddingRow, columns]);

    const handleSubmit = () => {
        console.log(sessionData, tableData);
        onClose()
        // setIsAddingSession(false)
    }

    return (
        <>
            <Table
                title="Selected Exercise"
                columns={columns}
                tableStates={{ data: tableData, primaryKey: 'exerciseId' }}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableEdit: true }}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
            <button className='add-session-btn' onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default AddSessionDialog;
