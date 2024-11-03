import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './AddScheduleDialog.scss';
import { Dialog } from '~/components';
import { Trash2 } from 'lucide-react';
import AddSessionsOfScheduleDialog from '../AddSessionsOfScheduleDialog/AddSessionsOfScheduleDialog';
import { ScheduleAdminThunk } from '~/redux/thunks/scheduleThunk';

function AddScheduleDialog({ scheduleData, setIsAddingSchedule, onClose }) {
    console.log('dialog');

    const dispatch = useDispatch()
    const sessionState = useSelector((state) => state.session);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.muscleId, text: muscle.muscleName }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))

    const [isAddingRow, setIsAddingRow] = useState(false);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
    const { ...selectedSessionState } = sessionState
    selectedSessionState.data = useMemo(() => sessionState.data.filter((row) => sessionState.selectedRows[row.sessionId]), [sessionState]);

    const columns = useMemo(
        () => [
            { header: 'Name', name: 'name', cell: row => <Input name="name" />, editable: false },
            { header: 'Muscle List', name: 'musclesList', cell: row => <MultiSelect name="musclesList" options={muscleOptions} />, editable: false },
            { header: 'Level', name: 'levelEnum', cell: row => <Select name="levelEnum" options={levelOptions} />, editable: false },
            { header: 'Description', name: 'description', cell: row => <Input name="description" />, editable: false },
            { header: 'Switch Exercise Delay', name: 'switchExerciseDelay', cell: (row) => <Input name="switchExerciseDelay" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" />, defaultValue: 0 },
            { header: 'Action', cell: row => <Trash2 onClick={() => setTableData(prev => prev.filter(rowData => rowData.id !== row.id))} /> },
        ],
        [muscleOptions, levelOptions],
    );

    // Create data for the dialog box with fields such as ordinal, downRepsRatio,...
    const initialTableData = useMemo(() =>
        selectedSessionState.data.map(rowData =>
            columns.reduce((acc, column) => {
                if (!acc[column.name]) acc[column.name] = column.defaultValue
                return acc
            }, { ...rowData })
        ), [columns, selectedSessionState.data]
    )

    console.log(initialTableData);

    const [tableData, setTableData] = useState(initialTableData)

    const rowProps = useCallback((rowData) => {
        const handleRowChange = (e) => {
            const { name, value } = e.target
            setTableData(prev => prev.map(row =>
                row.sessionId === rowData.sessionId ?
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
                    body: <AddSessionsOfScheduleDialog columns={columns} setTableData={setTableData} />,
                })
            },
        };
    }, [isAddingRow, setIsAddingRow, columns]);

    const handleSubmit = () => {
        const formData = {
            ...scheduleData,
            sessionsInfo: tableData.map(row => ({
                sessionId: row.sessionId,
                ordinal: row.ordinal,
            }))
        }
        console.log(formData);
        dispatch(ScheduleAdminThunk.createScheduleThunk(formData))
        onClose()
        setIsAddingSchedule(false)
    }

    return (
        <>
            <Table
                title="Selected Session"
                columns={columns}
                tableStates={{ data: tableData, primaryKey: 'sessionId' }}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableEdit: true }}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
            <button className='btn' onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default AddScheduleDialog;
