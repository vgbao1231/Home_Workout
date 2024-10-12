import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Pencil, Trash2, Upload } from 'lucide-react';
import Input from '../ui/Input/Input';
import MultiSelect from '../ui/MultiSelect/MultiSelect';
import Select from '../ui/Select/Select';
import Table from '../ui/Table/Table';
import './ExerciseTable.scss';
import { toggleSelectRow } from '~/redux/slices/exerciseSlice';
import { isRequired } from '~/utils/validators';
import {
    createExerciseThunk,
    deleteExerciseThunk,
    fetchExerciseThunk,
    updateExerciseThunk,
} from '~/redux/thunks/exerciseThunk';
import ContextMenu from '../ui/Table/ContextMenu/ContextMenu';
import Pagination from '../ui/Table/Pagination/Pagination';
import ShowImage from '../ui/Dialog/DialogContent/ShowImage/ShowImage';
import Dialog from '../ui/Dialog/Dialog';
import { addToast } from '~/redux/slices/toastSlice';

function ExerciseTable() {
    console.log('exercise table');

    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.level.levelData);
    const muscleData = useSelector((state) => state.muscle.muscleData);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const dataToSend = useCallback(
        (formData) => {
            const { muscleList, levelEnum, imageUrl, ...data } = formData; // Destructure all props
            if (muscleList) {
                data.muscleIds = muscleList.map((muscle) => muscleData.find((m) => m.raw === muscle)?.value);
            }
            if (levelEnum) {
                data.levelEnum = levelData.find((l) => l.raw === levelEnum)?.value;
            }
            return data;
        },
        [levelData, muscleData],
    );

    const exerciseColumns = useMemo(
        () => [
            { header: 'Name', field: <Input name="name" /> },
            { header: 'Muscle List', field: <MultiSelect name="muscleList" options={muscleData} /> },
            { header: 'Level', field: <Select name="levelEnum" options={levelData} /> },
            { header: 'Basic Reps', field: <Input name="basicReps" type="number" /> },
        ],
        [muscleData, levelData],
    );

    // Properties of table row
    const exerciseRowProps = (rowData) => {
        const isUpdating = rowData.exerciseId === updatingRowId;

        //Handle click row
        const handleClick = () => {
            !isUpdating && dispatch(toggleSelectRow(rowData.exerciseId));
        };

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    { text: 'Update Exercise', icon: <Pencil />, action: () => setUpdatingRowId(rowData.exerciseId) },
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
            if (formData) {
                dispatch(updateExerciseThunk(dataToSend(formData)));
            }
            setUpdatingRowId();
        };

        return {
            rowData,
            columns: exerciseColumns,
            isSelected: exerciseState.selectedRows[rowData.exerciseId],
            isUpdating,
            onClick: handleClick,
            onContextMenu: handleContextMenu,
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    };

    useEffect(() => {
        if (isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') setIsAddingRow(false); // Turn off adding mode
            };
            window.addEventListener('keydown', handleKeyDown);
            // Cleanup when component unmount or isAddingRow is false
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isAddingRow]);

    // Properties to create add row form
    const addExerciseRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                dispatch(createExerciseThunk(dataToSend(formData)));
                setIsAddingRow(false);
            },
            fields: [
                { field: <Input placeholder="Name" name="name" validators={{ isRequired }} /> },
                {
                    field: (
                        <MultiSelect
                            placeholder="Muscle List"
                            name="muscleList"
                            options={muscleData}
                            validators={{ isRequired }}
                        />
                    ),
                },
                { field: <Select placeholder="Select Level" name="level" options={levelData} /> },
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
    }, [muscleData, levelData, dispatch, dataToSend, isAddingRow]);

    //Handle filter data
    const handleFilter = useCallback(
        (filterData) => {
            filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));
            setFilterData(dataToSend(filterData));
        },
        [dataToSend],
    );

    //Handle sort data
    const handleSort = useCallback((sortData) => setSortData(sortData), []);

    //Handle close dialog
    const handleCloseDialog = () => {
        setDialogProps({ isOpen: false, title: '', content: null }); // Reset content when closing
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { sortedField, sortedMode } = sortData || {};
                await dispatch(
                    fetchExerciseThunk({
                        page: currentPage,
                        filterFields: filterData,
                        sortedField: sortedField,
                        sortedMode: sortedMode,
                    }),
                ).unwrap();
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
                columns={exerciseColumns}
                data={exerciseState.data}
                selectedRows={exerciseState.selectedRows}
                primaryKey={exerciseState.primaryKey}
                rowProps={exerciseRowProps}
                addRowProps={addExerciseRowProps}
                onFilter={handleFilter}
                onSort={handleSort}
                filterData={filterData}
                sortData={sortData}
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