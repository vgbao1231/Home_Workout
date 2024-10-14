import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Pencil, Trash2, Upload } from 'lucide-react';
import './ExerciseTable.scss';
import { toggleSelectRow } from '~/redux/slices/exerciseSlice';
import { isRequired } from '~/utils/validators';
import {
    createExerciseThunk,
    deleteExerciseThunk,
    fetchExerciseThunk,
    updateExerciseThunk,
} from '~/redux/thunks/exerciseThunk';
import { addToast } from '~/redux/slices/toastSlice';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import { Dialog, Input, MultiSelect, Select, Table } from '~/components';
import ShowImage from '~/components/ui/Dialog/DialogContent/ShowImage/ShowImage';
import Pagination from '~/components/ui/Table/Pagination/Pagination';

function ExerciseTable() {
    // console.log('exercise table');

    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [sortData, setSortData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const exerciseHeaders = useMemo(
        () => [
            { header: 'Name', name: 'name', buildField: (rowData) => <Input name="name" /> },
            {
                header: 'Muscle List',
                name: 'muscleList',
                buildField: (rowData) => (
                    <MultiSelect
                        name="muscleList"
                        options={muscleData.map((muscle) => ({ text: muscle['name'], value: muscle['id'] }))}
                    />
                ),
            },
            {
                header: 'Level',
                name: 'levelEnum',
                buildField: (rowData) => (
                    <Select
                        name="levelEnum"
                        options={levelData.map((dataObj) => ({
                            value: dataObj['level'],
                            text: dataObj['name'],
                        }))}
                    />
                ),
            },
            {
                header: 'Basic Reps',
                name: 'basicReps',
                buildField: (rowData) => <Input name="basicReps" type="number" />,
            },
        ],
        [muscleData, levelData],
    );

    // Properties of table row
    const exerciseRowProps = useMemo(() => {
        //Handle click row
        const handleClick = (_, rowData) => {
            rowData.exerciseId !== updatingRowId && dispatch(toggleSelectRow(rowData.exerciseId));
        };

        //Handle open menu when right click
        const handleContextMenu = (e, rowData) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    {
                        text: 'Update Exercise',
                        icon: <Pencil />,
                        action: () => setUpdatingRowId(rowData.exerciseId),
                    },
                    {
                        text: 'Delete Exercise',
                        icon: <Trash2 />,
                        action: () => {
                            window.confirm('Delete ?') && dispatch(deleteExerciseThunk(rowData.exerciseId));
                        },
                    },
                    {
                        text: 'Show Exercise Img',
                        icon: <Image />,
                        action: () =>
                            setDialogProps({
                                isOpen: true,
                                title: 'Exercise Image',
                                body: <ShowImage id={rowData.exerciseId} imageUrl={rowData.imageUrl} />,
                            }),
                    },
                ],
            });
        };

        // Handle update row data
        const handleUpdate = (formData) => {
            if (formData) dispatch(updateExerciseThunk(formData));
            setUpdatingRowId();
        };

        return {
            tableState: exerciseState,
            canSelectingRow: true,
            columns: exerciseHeaders,
            updatingRowId,
            eventRegistered: (rowData) => ({
                onClick: (e) => handleClick(e, rowData),
                onContextMenu: (e) => handleContextMenu(e, rowData),
            }),
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    }, [exerciseState, updatingRowId, dispatch, levelData, muscleData]);

    // Properties to create add row form
    const addExerciseRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                dispatch(createExerciseThunk(formData));
                setIsAddingRow(false);
            },
            fields: [
                { field: <Input placeholder="Name" name="name" validators={{ isRequired }} /> },
                {
                    field: (
                        <MultiSelect
                            placeholder="Muscle List"
                            name="muscleIds"
                            options={muscleData.map((muscle) => ({ text: muscle['name'], value: muscle['id'] }))}
                            validators={{ isRequired }}
                        />
                    ),
                },
                {
                    field: (
                        <Select
                            placeholder="Select Level"
                            name="level"
                            options={levelData.map((dataObj) => ({
                                value: dataObj['level'],
                                text: dataObj['name'],
                            }))}
                        />
                    ),
                },
                { field: <Input placeholder="Basic Reps" name="basicReps" /> },
                {
                    field: (
                        <label htmlFor="exercise-img" style={{ display: 'flex' }}>
                            <Upload className="upload-icon" />
                            <Input id="exercise-img" name="img" type="file" validators={{ isRequired }} />
                        </label>
                    ),
                },
            ],
        };
    }, [muscleData, levelData, isAddingRow, setIsAddingRow]);

    //Handle sort data
    const handleSort = useCallback((sortData) => setSortData(sortData), []);

    //Handle close dialog
    const handleCloseDialog = () => {
        setDialogProps({ isOpen: false, title: '', content: null }); // Reset content when closing
    };

    useEffect(() => {
        if (isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setIsAddingRow(false); // Turn off adding mode
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            // Cleanup when component unmount or isAddingRow is false
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isAddingRow]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { sortedField, sortedMode } = sortData || {};

                const objToGetData = {
                    page: currentPage,
                    filterFields: filterData,
                    sortedField: sortedField,
                    sortedMode: sortedMode,
                };

                await dispatch(fetchExerciseThunk(objToGetData)).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };

        fetchData();
    }, [dispatch, sortData, filterData, currentPage]);

    return exerciseState.loading ? (
        <div>Loading Exercise Data...</div>
    ) : (
        <div className="exercise-table">
            <Table
                title="Exercise"
                headers={exerciseHeaders}
                data={exerciseState.data}
                selectedRows={exerciseState.selectedRows}
                primaryKey={exerciseState.primaryKey}
                rowProps={exerciseRowProps}
                addRowProps={addExerciseRowProps}
                onFilter={handleFilter}
                onSort={handleSort}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={exerciseState.totalPages}
            />
            <Dialog onClose={handleCloseDialog} {...dialogProps} />
        </div>
    );
}

export default ExerciseTable;
