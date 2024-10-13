import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import Input from '../../../components/ui/Input/Input';
import MultiSelect from '../../../components/ui/MultiSelect/MultiSelect';
import Select from '../../../components/ui/Select/Select';
import Table from '../../../components/ui/Table/Table';
import './SessionTable.scss';
import { toggleSelectRow } from '~/redux/slices/sessionSlice';
import { isRequired } from '~/utils/validators';
import {
    createSessionThunk,
    deleteSessionThunk,
    fetchSessionThunk,
    updateSessionThunk,
} from '~/redux/thunks/sessionThunk';
import ContextMenu from '../../../components/ui/Table/ContextMenu/ContextMenu';
import Pagination from '../../../components/ui/Table/Pagination/Pagination';
import Dialog from '../../../components/ui/Dialog/Dialog';
import { addToast } from '~/redux/slices/toastSlice';
import ShowSelectedExercises from '../../../components/ui/Dialog/DialogContent/ShowSelectedExercises/ShowSelectedExercises';

function SessionTable() {
    console.log('session table');

    const dispatch = useDispatch();
    const selectedExercise = useSelector((state) => state.exercise.selectedRows);
    const sessionState = useSelector((state) => state.session);
    const levelData = useSelector((state) => state.enum.levels);
    const muscleData = useSelector((state) => state.enum.muscles);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });


    const sessionColumns = useMemo(
        () => [
            { header: 'Name', field: <Input name="name" /> },
            { header: 'Muscle List', field: <MultiSelect name="muscleList" options={muscleData.map(dataObj => ({
                value: dataObj["id"], text: dataObj["name"]
            }))} /> },
            { header: 'Level', field: <Select name="levelEnum" options={levelData.map(dataObj => ({
                value: dataObj["level"], text: dataObj["name"]
            }))} /> },
            { header: 'Description', field: <Input name="description" type="number" /> },
        ],
        [muscleData, levelData],
    );

    // Properties of table row
    const sessionRowProps = (rowData) => {
        const isUpdating = rowData.sessionId === updatingRowId;

        //Handle click row
        const handleClick = () => {
            !isUpdating && dispatch(toggleSelectRow(rowData.sessionId));
        };

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    { text: 'Update Session', icon: <Pencil />, action: () => setUpdatingRowId(rowData.sessionId) },
                    {
                        text: 'Delete Session',
                        icon: <Trash2 />,
                        action: () => {
                            window.confirm('Delete ?') && dispatch(deleteSessionThunk(rowData.sessionId));
                        },
                    },
                ],
            });
        };

        // Handle update row data
        const handleUpdate = (formData) => {
            if (formData) {
                dispatch(updateSessionThunk(formData));
            }
            setUpdatingRowId();
        };

        return {
            rowData,
            columns: sessionColumns,
            isSelected: sessionState.selectedRows[rowData.sessionId],
            isUpdating,
            onClick: handleClick,
            onContextMenu: handleContextMenu,
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    };

    // Properties to create add row form
    const addSessionRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                // If no row selected
                if (Object.values(selectedExercise).every((v) => !v)) {
                    alert('Please select exercises for this session');
                } else {
                    setDialogProps({
                        isOpen: true,
                        title: 'Selected Exercise',
                        body: <ShowSelectedExercises />,
                    });
                    // dispatch(createSessionThunk(dataToSend(formData)));
                }
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
                { field: <Input placeholder="Description" name="description" /> },
            ],
        };
    }, [muscleData, levelData, isAddingRow, selectedExercise, dispatch]);

    //Handle filter data
    const handleFilter = useCallback(
        (filterData) => {
            filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));

            setFilterData(filterData);
        },
        [],
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
                    fetchSessionThunk({
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

    return sessionState.loading ? (
        <div>Loading Session Data...</div>
    ) : (
        <div className="session-table">
            <Table
                title="Session"
                columns={sessionColumns}
                data={sessionState.data}
                selectedRows={sessionState.selectedRows}
                primaryKey={sessionState.primaryKey}
                rowProps={sessionRowProps}
                addRowProps={addSessionRowProps}
                onFilter={handleFilter}
                onSort={handleSort}
                filterData={filterData}
                sortData={sortData}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={sessionState.totalPages}
            />
            <Dialog onClose={handleCloseDialog} {...dialogProps} />
        </div>
    );
}

export default SessionTable;
