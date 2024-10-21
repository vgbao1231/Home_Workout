import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookText, Pencil, Trash2 } from 'lucide-react';
import './SessionTable.scss';
import { sessionActions, toggleSelectRow } from '~/redux/slices/sessionSlice';
import { addToast } from '~/redux/slices/toastSlice';
import { Dialog, Input, MultiSelect, Select, Table } from '~/components';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import AddSessionDialog from './AddSessionDialog/AddSessionDialog';
import ExercisesOfSessionDialog from './ExercisesOfSessionDialog/ExercisesOfSessionDialog';
import { SessionAdminThunk } from '~/redux/thunks/sessionThunk';

function SessionTable() {
    const dispatch = useDispatch();
    const selectedExercise = useSelector((state) => state.exercise.selectedRows);
    const sessionState = useSelector((state) => state.session);
    const { sortData, filterData } = sessionState
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
        { header: 'Description', name: 'description', cell: (row) => <Input name="description" /> },
        { header: 'Switch Exercise Delay', name: 'switchExerciseDelay', cell: (row) => <Input name="switchExerciseDelay" /> },
    ], [muscleOptions, levelOptions]);

    // Properties of table row
    const rowProps = useCallback((rowData) => {
        const isUpdating = rowData.sessionId === updatingRowId;
        const isSelected = sessionState.selectedRows[rowData.sessionId];

        //Handle click row
        const handleClick = () => !isUpdating && dispatch(toggleSelectRow(rowData.sessionId));

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    {
                        text: 'Show Exercise', icon: <BookText />, action: () =>
                            setDialogProps({
                                isOpen: true,
                                className: 'exercises-of-session',
                                body: <ExercisesOfSessionDialog id={rowData.sessionId} />,
                            })
                    },
                    { text: 'Update Session', icon: <Pencil />, action: () => setUpdatingRowId(rowData.sessionId) },
                    {
                        text: 'Delete Session', icon: <Trash2 />,
                        action: () => window.confirm('Delete ?') && dispatch(SessionAdminThunk.deleteSessionThunk(rowData.sessionId))
                    },
                ],
            });
        };

        // Handle update row data
        const handleUpdate = (formData) => {
            if (formData)
                dispatch(SessionAdminThunk.updateSessionThunk(formData));
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
    }, [dispatch, sessionState.selectedRows, updatingRowId])

    // Properties to create add row form
    const addRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                if (Object.values(selectedExercise).every((v) => !v)) {
                    alert('Please select exercises for this session');
                } else {
                    setDialogProps({
                        isOpen: true,
                        className: 'add-session',
                        body: <AddSessionDialog sessionData={formData} setIsAddingSession={setIsAddingRow} />,
                    });
                }
            },
            fields: [
                { field: <Input placeholder="Name" name="name" defaultValue='123' /> },
                { field: <MultiSelect placeholder="Muscle List" name="muscleIds" options={muscleOptions} defaultValue={[1, 2]} /> },
                { field: <Select placeholder="Select Level" name="level" options={levelOptions} defaultValue='1' /> },
                { field: <Input placeholder="Description" name="description" defaultValue='123' /> },
                { field: <Input placeholder="Switch Exercise Delay" name="switchExerciseDelay" defaultValue='300' /> },
            ],
        };
    }, [levelOptions, muscleOptions, selectedExercise, isAddingRow, setIsAddingRow]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(SessionAdminThunk.fetchSessionThunk({
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

    return sessionState.loading ? (
        <div>Loading Session Data...</div>
    ) : (
        <div className="session-table">
            <Table
                title="Session"
                columns={columns}
                tableStates={sessionState}
                tableReducers={sessionActions}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableFilter: true, enableSort: true, enableSelect: true }}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={sessionState.totalPages} />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}

export default SessionTable;
