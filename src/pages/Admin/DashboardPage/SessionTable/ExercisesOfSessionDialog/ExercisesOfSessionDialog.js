import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '~/components/ui/Input/Input';
import MultiSelect from '~/components/ui/MultiSelect/MultiSelect';
import Select from '~/components/ui/Select/Select';
import Table from '~/components/ui/Table/Table';
import './ExercisesOfSessionDialog.scss';
import { addToast } from '~/redux/slices/toastSlice';
import { Dialog } from '~/components';
import AddExercisesOfSessionDialog from '../AddExercisesOfSessionDialog/AddExercisesOfSessionDialog';
import { Trash2 } from 'lucide-react';
import { ExerciseAdminService } from '~/services/exerciseService';

function ExercisesOfSessionDialog({ id, onClose }) {
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
            { header: 'Basic Reps', name: 'basicReps', cell: row => <Input name="basicReps" type="number" />, editable: false },
            { header: 'Ordinal', name: 'ordinal', cell: row => <Input name="ordinal" type="number" />, defaultValue: tableData.length + 1 },
            { header: 'Iteration', name: 'iteration', cell: row => <Input name="iteration" type="number" />, defaultValue: 1 },
            { header: 'Down Reps Ratio', name: 'downRepsRatio', cell: row => <Input name="downRepsRatio" type="number" />, defaultValue: 0 },
            { header: 'Slack In Second', name: 'slackInSecond', cell: row => <Input name="slackInSecond" type="number" />, defaultValue: 0 },
            { header: 'Raise Slack In Second', name: 'raiseSlackInSecond', cell: row => <Input name="raiseSlackInSecond" type="number" />, defaultValue: 0 },
            {
                header: 'Need Switch Exercise Delay', name: 'needSwitchExerciseDelay', defaultValue: false,
                cell: row => <Select name="needSwitchExerciseDelay" options={[{ value: true, text: "True" }, { value: false, text: "False" }]} />
            },
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
                    body: <AddExercisesOfSessionDialog columns={columns} setTableData={setTableData} />,
                })
            },
        };
    }, [isAddingRow, setIsAddingRow, columns]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ExerciseAdminService.getExercisesOfSessionRelationship(id)
                const responseData = response.data.map(element => {
                    const { exercise, ...rest } = element
                    return {
                        ...rest,
                        ...exercise,
                        musclesList: exercise.muscles.map(muscle => muscle.muscleName)
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
            sessionId: id,
            exercisesInfo: tableData.map(row => ({
                exerciseId: row.exerciseId,
                ordinal: row.ordinal,
                downRepsRatio: row.downRepsRatio,
                slackInSecond: row.slackInSecond,
                raiseSlackInSecond: row.raiseSlackInSecond,
                iteration: row.iteration,
                needSwitchExerciseDelay: row.needSwitchExerciseDelay,
            }))
        }
        console.log(formData);
        ExerciseAdminService.updateExercisesOfSessionRelationship(formData)
        onClose()
    }

    return isLoading ? (
        <div>Loading Exercise Data...</div>
    ) : (
        <>
            <Table
                title="Exercises Of Session"
                columns={columns}
                tableStates={{ data: tableData, primaryKey: 'exerciseId' }}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableEdit: true }}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
            <button className="btn" onClick={handleSubmit}>Update</button>
        </>
    );
}

export default ExercisesOfSessionDialog;
