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
import ShowSelectedExercises from './ShowSelectedExercises/ShowSelectedExercises';

function SessionTable() {

    const dispatch = useDispatch();
    const selectedExercise = useSelector((state) => state.exercise.selectedRows);
    console.log(selectedExercise);

    const sessionState = useSelector((state) => state.session);
    const levelData = useSelector((state) => state.enum.data.levels);
    const muscleData = useSelector((state) => state.enum.data.muscles);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const sessionHeaders = useMemo(() => [
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
        { header: 'Description', name: 'description', buildField: rowData => <Input name="description" type="number" /> },
    ], [muscleData, levelData]);

    // Properties of table row
    const sessionRowProps = useMemo(() => {
        //Handle click row
        const handleClick = (_, rowData) => {
            (rowData.sessionId !== updatingRowId) && dispatch(toggleSelectRow(rowData.sessionId));
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
                        text: 'Update Session', icon: <Pencil />, action: () => setUpdatingRowId(rowData.sessionId)
                    },
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
            if (formData)
                dispatch(updateSessionThunk(formData));
            setUpdatingRowId();
        };

        return {
            tableState: sessionState,
            columns: [
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
                { header: 'Description', name: 'description', buildField: rowData => <Input name="description" type="number" /> },
            ],
            updatingRowId,
            eventRegistered: rowData => ({
                onClick: (e) => handleClick(e, rowData),
                onContextMenu: (e) => handleContextMenu(e, rowData),
            }),
            onSubmit: handleUpdate,
            confirm: true, // Ask confirm before submit
        };
    }, [dispatch, levelData, muscleData, sessionState, updatingRowId]);

    // Properties to create add row form
    const addSessionRowProps = useMemo(() => {
        return {
            onSubmit: (formData) => {
                // If no row selected
                console.log(selectedExercise);

                if (Object.values(selectedExercise).every((v) => !v)) {
                    alert('Please select exercises for this session');
                } else {
                    setDialogProps({
                        isOpen: true,
                        title: 'Selected Exercise',
                        body: <ShowSelectedExercises />,
                    });
                    // dispatch(createSessionThunk(formData));
                }
            },
            fields: [
                { field: <Input placeholder="Name" name="name" validators={{ isRequired }} /> },
                {
                    field: (
                        <MultiSelect
                            placeholder="Muscle List"
                            name="muscleIds"
                            options={muscleData.map(muscle => (
                                { text: muscle["name"], value: muscle["id"] }
                            ))}
                            validators={{ isRequired }}
                        />
                    ),
                },
                {
                    field: <Select placeholder="Select Level" name="level" options={levelData.map(dataObj => ({
                        value: dataObj["level"], text: dataObj["name"]
                    }))} />
                },
                { field: <Input placeholder="Description" name="description" /> },
            ],
        };
    }, [muscleData, levelData, selectedExercise]);

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

                await dispatch(fetchSessionThunk(objToGetData)).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };

        fetchData();
    }, [dispatch, sortData, filterData, currentPage]);

    return sessionState.loading ? (
        <div>Loading Session Data...</div>
    ) : (
        <>
            <Table
                className="session-table"
                title="Session"
                headers={sessionHeaders}
                state={sessionState}
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
        </>
    );
}

export default SessionTable;
