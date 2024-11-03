import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './SessionsOfScheduleDialog.scss';
import { addToast } from '~/redux/slices/toastSlice';
import { Dialog } from '~/components';
import { Trash2 } from 'lucide-react';
import AddSessionsOfScheduleDialog from '../AddSessionsOfScheduleDialog/AddSessionsOfScheduleDialog';
import { SessionAdminService } from '~/services/sessionService';

function SessionsOfScheduleDialog({ id, onClose }) {
    console.log('ok');

    const dispatch = useDispatch();
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.muscleId, text: muscle.muscleName }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))
    const [tableData, setTableData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const columns = useMemo(
        () => [
            { header: 'Name', name: 'name', cell: row => <Input name="name" />, editable: false },
            { header: 'Muscle List', name: 'musclesList', cell: row => <MultiSelect name="musclesList" options={muscleOptions} />, editable: false },
            { header: 'Level', name: 'levelEnum', cell: row => <Select name="levelEnum" options={levelOptions} />, editable: false },
            { header: 'Description', name: 'description', cell: row => <Input name="description" />, editable: false },
            { header: 'Switch Exercise Delay', name: 'switchExerciseDelay', cell: (row) => <Input name="switchExerciseDelay" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" />, defaultValue: tableData.length + 1 },
            { header: 'Action', cell: row => <Trash2 onClick={() => setTableData(prev => prev.filter(rowData => rowData.id !== row.id))} /> },
        ],
        [muscleOptions, levelOptions, tableData],
    );

    const rowProps = useCallback((rowData) => {
        return {}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SessionAdminService.getSessionsOfScheduleRelationship(id)
                const responseData = response.data.map(element => {
                    const { session, ...rest } = element
                    return {
                        ...rest,
                        ...session,
                        musclesList: session.muscles.map(muscle => muscle.muscleName)
                    };
                });
                setTableData(responseData)
                setIsLoading(false)
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };

        fetchData();
    }, [dispatch, id]);

    const handleSubmit = () => {
        const formData = {
            scheduleId: id,
            sessionsInfo: tableData.map(row => ({
                sessionId: row.sessionId,
                ordinal: row.ordinal,
            }))
        }
        console.log(formData);
        SessionAdminService.updateSessionsOfScheduleRelationship(formData)
        onClose()
    }

    return isLoading ? (
        <div>Loading Session Data...</div>
    ) : (
        <>
            <Table
                title="Sessions Of Schedule"
                columns={columns}
                tableStates={{ data: tableData, primaryKey: 'sessionId' }}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableEdit: true }}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
            <button className="btn" onClick={handleSubmit}>Update</button>
        </>
    );
}

export default SessionsOfScheduleDialog;
