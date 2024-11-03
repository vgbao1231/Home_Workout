import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Pencil, Trash2, Upload } from 'lucide-react';
import './ExerciseTable.scss';
import { exerciseActions, toggleSelectRow } from '~/redux/slices/exerciseSlice';
import { addToast } from '~/redux/slices/toastSlice';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import { Dialog, Input, MultiSelect, Select, Table } from '~/components';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import ExerciseImageDialog from './ExerciseImageDialog/ExerciseImageDialog';
import { ExerciseAdminThunk } from '~/redux/thunks/exerciseThunk';

function ExerciseTable() {
    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const { sortData, filterData } = exerciseState
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
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
        const isUpdating = rowData.exerciseId === updatingRowId;
        const isSelected = exerciseState.selectedRows[rowData.exerciseId];

        //Handle click row
        const handleClick = () => !isUpdating && dispatch(toggleSelectRow(rowData.exerciseId));

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    {
                        text: 'Update Exercise', icon: <Pencil />, action: () => {
                            setUpdatingRowId(rowData.exerciseId)
                            dispatch(addToast("Press Enter to save, Escape to cancel", "info", 6000))
                        }
                    },
                    {
                        text: 'Delete Exercise', icon: <Trash2 />,
                        action: () => window.confirm('Delete ?') && dispatch(ExerciseAdminThunk.deleteExerciseThunk(rowData.exerciseId))
                    },
                    {
                        text: 'Show Exercise Img', icon: <Image />,
                        action: () =>
                            setDialogProps({
                                isOpen: true,
                                title: 'Exercise Image',
                                className: 'exercise-image-dialog',
                                body: <ExerciseImageDialog id={rowData.exerciseId} imageUrl={rowData.imageUrl} />,
                            }),
                    },
                ],
            });
        };

        // Handle update row data
        const handleUpdate = (rowData) => {
            if (rowData) {
                const formData = {
                    exerciseId: rowData.exerciseId,
                    name: rowData.name,
                    basicReps: rowData.basicReps,
                    level: rowData.levelEnum,
                    muscleIds: rowData.musclesList,
                }
                console.log(formData);
                // dispatch(ExerciseAdminThunk.updateExerciseThunk(formData));
            }
            setUpdatingRowId();
        };

        return {
            isSelected,
            isUpdating,
            onClick: handleClick,
            onContextMenu: handleContextMenu,
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    }, [dispatch, exerciseState.selectedRows, updatingRowId])

    // Properties to create add row form
    const addRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                dispatch(ExerciseAdminThunk.createExerciseThunk(formData));
                setIsAddingRow(false);
            },
            fields: [
                { field: <Input placeholder="Name" name="name" /> },
                { field: <MultiSelect placeholder="Muscle List" name="muscleIds" options={muscleOptions} /> },
                { field: <Select placeholder="Select Level" name="level" options={levelOptions} /> },
                { field: <Input placeholder="Basic Reps" name="basicReps" /> },
                {
                    field:
                        <label htmlFor="exercise-img" style={{ display: 'flex' }}>
                            <Upload className="upload-icon" />
                            <Input id="exercise-img" name="img" type="file" />
                        </label>
                },
            ],
        };
    }, [levelOptions, muscleOptions, isAddingRow, setIsAddingRow, dispatch]);

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
        <div className="exercise-table">
            <Table
                title="Exercise"
                columns={columns}
                tableStates={exerciseState}
                tableReducers={exerciseActions}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableFilter: true, enableSort: true, enableSelect: true }}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={exerciseState.totalPages}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}

export default ExerciseTable;
