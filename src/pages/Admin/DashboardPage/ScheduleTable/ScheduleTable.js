import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BookText, Pencil, Trash2 } from 'lucide-react';
import './ScheduleTable.scss';
import { addToast } from '~/redux/slices/toastSlice';
import { Dialog, Input, Select, Table } from '~/components';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import { ScheduleAdminThunk } from '~/redux/thunks/scheduleThunk';
import { scheduleActions, toggleSelectRow } from '~/redux/slices/scheduleSlice';
import AddScheduleDialog from './AddScheduleDialog/AddScheduleDialog';
import SessionsOfScheduleDialog from './SessionsOfScheduleDialog/SessionsOfScheduleDialog';

function ScheduleTable() {
    const dispatch = useDispatch();
    const selectedSession = useSelector((state) => state.session.selectedRows);
    const scheduleState = useSelector((state) => state.schedule);
    const { sortData, filterData } = scheduleState
    const levelData = useSelector((state) => state.enum.data.levels);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });
    const levelOptions = levelData.map((level) => ({ value: level.level, text: level.name }))

    const columns = useMemo(() => [
        { header: 'Name', name: 'name', cell: (row) => <Input name="name" /> },
        { header: 'Description', name: 'description', cell: (row) => <Input name="description" /> },
        {
            header: 'Level', name: 'levelEnum', cell: (row) => <Select name="levelEnum" options={levelOptions} />,
            customFilter: (row) => <Select name="level" options={levelOptions} />
        },
        { header: 'Coins', name: 'coins', cell: (row) => <Input name="coins" />, filterable: false },
        { header: 'From coins', name: 'fromCoins', cell: (row) => <Input name="fromCoins" />, hidden: true },
        { header: 'To coins', name: 'toCoins', cell: (row) => <Input name="toCoins" />, hidden: true },
        // {
        //     header: 'Coins', name: 'coins', cell: (row) => <Input name="coins" />,
        //     customFilter: (row) =>
        //         <div className='flex-col' style={{ gap: '4px' }}>
        //             <Input name="fromCoins" placeholder='From' />
        //             <Input name="toCoins" placeholder='To' />
        //         </div>
        // },
    ], [levelOptions]);

    // Properties of table row
    const rowProps = useCallback((rowData) => {
        const isUpdating = rowData.scheduleId === updatingRowId;
        const isSelected = scheduleState.selectedRows[rowData.scheduleId];

        //Handle click row
        const handleClick = () => !isUpdating && dispatch(toggleSelectRow(rowData.scheduleId));

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    {
                        text: 'Show Session', icon: <BookText />, action: () =>
                            setDialogProps({
                                isOpen: true,
                                className: 'sessions-of-schedule',
                                body: <SessionsOfScheduleDialog id={rowData.scheduleId} />,
                            })
                    },
                    { text: 'Update Schedule', icon: <Pencil />, action: () => setUpdatingRowId(rowData.scheduleId) },
                    {
                        text: 'Delete Schedule', icon: <Trash2 />,
                        action: () => window.confirm('Delete ?') && dispatch(ScheduleAdminThunk.deleteScheduleThunk(rowData.scheduleId))
                    },
                ],
            });
        };

        // Handle update row data
        const handleUpdate = (formData) => {
            if (formData)
                dispatch(ScheduleAdminThunk.updateScheduleThunk(formData));
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
    }, [dispatch, scheduleState.selectedRows, updatingRowId])

    // Properties to create add row form
    const addRowProps = useMemo(() => {
        return {
            isAddingRow,
            setIsAddingRow,
            onSubmit: (formData) => {
                if (Object.values(selectedSession).every((v) => !v)) {
                    alert('Please select sessions for this schedule');
                } else {
                    setDialogProps({
                        isOpen: true,
                        className: 'add-schedule',
                        body: <AddScheduleDialog scheduleData={formData} setIsAddingSchedule={setIsAddingRow} />,
                    });
                }
            },
            fields: [
                { field: <Input placeholder="Name" name="name" defaultValue='123' /> },
                { field: <Input placeholder="Description" name="description" defaultValue='123' /> },
                { field: <Select placeholder="Select Level" name="level" options={levelOptions} defaultValue='1' /> },
                { field: <Input placeholder="Coins" name="coins" defaultValue='300' /> },
            ],
        };
    }, [levelOptions, selectedSession, isAddingRow, setIsAddingRow]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(ScheduleAdminThunk.fetchScheduleThunk({
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

    return scheduleState.loading ? (
        <div>Loading Schedule Data...</div>
    ) : (
        <div className="schedule-table">
            <Table
                title="Schedule"
                columns={columns}
                tableStates={scheduleState}
                tableReducers={scheduleActions}
                rowProps={rowProps}
                addRowProps={addRowProps}
                tableModes={{ enableFilter: true, enableSort: true, enableSelect: true }}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={scheduleState.totalPages} />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}

export default ScheduleTable;
