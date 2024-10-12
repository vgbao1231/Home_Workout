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
    // console.log('exercise table');

    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const exerciseColumns = useMemo(() => [
        // { header: '', field: <Input type="checkbox" name="exerciseId" /> },
        { header: 'Name', name: 'name', buildField: rowData => <Input name="name" /> },
        {
            header: 'Muscle List',
            name: 'muscleList',
            buildField: rowData => <MultiSelect name="muscleList" options={muscleData.map(muscle => (
                { text: muscle["name"], value: muscle["id"] }
            ))} />,
        },
        {
            header: 'Level', name: 'levelEnum', buildField: rowData => <Select name="levelEnum" options={levelData.map(dataObj => ({
                value: dataObj["level"], text: dataObj["name"]
            }))} />
        },
        { header: 'Basic Reps', name: 'basicReps', buildField: rowData => <Input name="basicReps" type="number" /> },
    ], [muscleData, levelData]);

    // Properties of table row
    const exerciseRowProps = useMemo(() => {
        //Handle click row
        const handleClick = (_, rowData) => {
            (rowData.exerciseId !== updatingRowId) && dispatch(toggleSelectRow(rowData.exerciseId));
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
                        text: 'Update Exercise', icon: <Pencil />, action: () => setUpdatingRowId(rowData.exerciseId)
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
            if (formData)
                dispatch(updateExerciseThunk(formData));
            setUpdatingRowId();
        };

        return {
            tableState: exerciseState,
            columns: exerciseColumns,
            updatingRowId,
            handleClick,
            handleContextMenu,
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    }, [exerciseState, updatingRowId]);

    // Properties to create add row form
    const addExerciseRowProps = useMemo(() => {
        return {
            onSubmit: (formData) => dispatch(createExerciseThunk(formData)),
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
    }, [muscleData, levelData, dispatch]);

    //Handle filter data
    const handleFilter = useCallback((filterData) => {
        filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));
        setFilterData(filterData);
    }, []);

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

                const objToGetData = {
                    page: currentPage,
                    filterFields: filterData,
                    sortedField: sortedField,
                    sortedMode: sortedMode,
                };
                console.log(objToGetData);

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
        <>
            <Table
                className="exercise-table"
                title="Exercise"
                state={exerciseState}
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
        </>
    );
}

export default ExerciseTable;
