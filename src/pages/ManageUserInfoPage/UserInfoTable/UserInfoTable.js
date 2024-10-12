import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from 'lucide-react';
import Input from '../ui/Input/Input';
import Select from '../ui/Select/Select';
import Table from '../ui/Table/Table';
import './ExerciseTable.scss';
import { toggleSelectRow } from '~/redux/slices/exerciseSlice';
import { isEmail, isRequired } from '~/utils/validators';
import { UserInfoAdminThunk, UserInfoUserThunk } from '~/redux/thunks/userInfoThunk';
import ContextMenu from '../ui/Table/ContextMenu/ContextMenu';
import Pagination from '../ui/Table/Pagination/Pagination';
import ShowImage from '../ui/Dialog/DialogContent/ShowImage/ShowImage';
import { addToast } from '~/redux/slices/toastSlice';
import SubscriptionsDialog from './SubscriptionsDialog/SubscriptionsDialog';

function UserInfoTable() {
    console.log('exercise table');

    const dispatch = useDispatch();
    const userInfoState = useSelector((state) => state.userInfo);
    const genderData = useSelector((state) => state.enum.data.genders)
    const [contextMenu, setContextMenu] = useState({});
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const userInfoColumns = useMemo(() => [
        { header: 'First Name', name: 'firstName', field: <Input name="firstName" /> },
        { header: 'Last Name', name: 'lastName', field: <Input name="lastName" /> },
        { header: 'Date of Birth', name: 'dob', field: <Input type="date" name="dob" /> },
        {
            header: 'Gender',
            name: 'gender',
            field: <Select name="gender" options={genderData.map(dataObj => ({
                value: dataObj["id"], text: dataObj["raw"]
            }))} />,
        },
        { header: 'Email', name: 'dob', field: <Input name="email" validators={[isEmail]} /> },
        { header: 'Basic Reps', name: 'basicReps', field: <Input name="basicReps" type="number" /> },
    ], [muscleData, levelData]);


    // Properties of table row
    const exerciseRowProps = useCallback((rowData) => {
        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    {
                        text: 'Show Subscriptions',
                        icon: <Book />,
                        action: () =>
                            setDialogProps({
                                isOpen: true,
                                title: 'Subscriptions',
                                body: <SubscriptionsDialog userInfoId={rowData.userInfoId} />,
                            }),
                    },
                ],
            });
        };

        return {
            rowData,
            columns: userInfoColumns,
            onContextMenu: handleContextMenu,
        };
    }, []);

    //Handle close dialog
    const handleCloseDialog = () => {
        setDialogProps({ isOpen: false, title: '', content: null }); // Reset content when closing
    };

    //Handle filter data
    const handleFilter = useCallback((filterData) => {
        filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));
        setFilterData(filterData);
    }, []);

    //Handle sort data
    const handleSort = useCallback((sortData) => setSortData(sortData), []);

    useEffect(() => {
        (async function fetchData() {
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
        })();
    }, [dispatch, sortData, filterData, currentPage]);

    return userInfoState.loading ? (
        <div>Loading Exercise Data...</div>
    ) : (
        <>
            <Table
                className="user-info-table"
                title="User Information"
                columns={userInfoColumns}
                state={userInfoState}
                rowProps={exerciseRowProps}
                onFilter={handleFilter}
                onSort={handleSort}
                filterData={filterData}
                sortData={sortData}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={userInfoState.totalPages}
            />
            <Dialog onClose={handleCloseDialog} {...dialogProps} />
        </>
    );
}

export default UserInfoTable;
