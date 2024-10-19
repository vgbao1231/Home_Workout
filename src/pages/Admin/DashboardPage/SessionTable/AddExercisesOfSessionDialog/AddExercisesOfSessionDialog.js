import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, MultiSelect, Select, Table } from "~/components";
import Pagination from "~/components/ui/Table/Pagination/Pagination";
import { addToast } from "~/redux/slices/toastSlice";
import './AddExercisesOfSessionDialog.scss'
import { ExerciseAdminThunk } from "~/redux/thunks/exerciseThunk";

function AddExercisesOfSessionDialog({ columns: exerciseOfSessionColumns, setTableData, onClose }) {
    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const { sortData, filterData } = exerciseState
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const [currentPage, setCurrentPage] = useState(1);
    const muscleOptions = muscleData.map((muscle) => ({ value: muscle.muscleId, text: muscle.muscleName }))
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))

    const columns = useMemo(() => [
        { header: 'Name', name: 'name', cell: (row) => <Input name="name" /> },
        {
            header: 'Muscle List', name: 'musclesList', cell: (row) => <MultiSelect name="musclesList" options={muscleOptions} />,
            customFilter: (row) => <MultiSelect name="muscleIds" options={muscleOptions} />, sortable: false
        },
        {
            header: 'Level', name: 'levelEnum', cell: (row) => <Select name="levelEnum" options={levelOptions} />,
            customFilter: (row) => <Select name="level" options={levelOptions} />
        },
        { header: 'Basic Reps', name: 'basicReps', cell: (row) => <Input name="basicReps" type="number" /> },
    ], [muscleOptions, levelOptions]);

    // Properties of table row
    const rowProps = useCallback((rowData) => {
        //Handle click row
        const handleClick = () => {
            // Add more field and value to rowData like ordinal, slack,...
            const formatredRowData = exerciseOfSessionColumns.reduce((acc, column) => {
                if (!acc[column.name]) acc[column.name] = column.defaultValue
                return acc
            }, { ...rowData })
            setTableData(prev => [...prev, { id: prev.length + 1, ...formatredRowData }])
            onClose()
        };

        return {
            onClick: handleClick,
        };
    }, [exerciseOfSessionColumns, onClose, setTableData])

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(ExerciseAdminThunk.fetchExerciseThunk({
                    page: currentPage,
                    filterFields: filterData,
                    sortedField: sortData?.sortedField,
                    sortedMode: sortData?.sortedMode,
                })).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };

        fetchData();
    }, [dispatch, currentPage, sortData, filterData]);

    return exerciseState.loading ? (
        <div>Loading Exercise Data...</div>
    ) : (
        <div className="add-exercises-of-session-table">
            <Table
                title="Select Exercises"
                columns={columns}
                tableStates={exerciseState}
                rowProps={rowProps}
                tableModes={{ enableFilter: true, enableSort: true }}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={exerciseState.totalPages}
            />
        </div>
    );
}

export default AddExercisesOfSessionDialog;