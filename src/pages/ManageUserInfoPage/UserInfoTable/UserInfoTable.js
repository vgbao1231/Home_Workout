import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from 'lucide-react';
import { UserInfoAdminThunk } from '~/redux/thunks/userInfoThunk';
import { addToast } from '~/redux/slices/toastSlice';
import SubscriptionsDialog from './SubscriptionsDialog/SubscriptionsDialog';
import { Dialog, Input, Select, Table } from '~/components';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import './UserInfoTable.scss';

export default function UserInfoTable() {
    const dispatch = useDispatch();
    const userInfoState = useSelector((state) => state.userInfo);
    const [contextMenu, setContextMenu] = useState({});
    const [sortData, setSortData] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const userInfoHeaders = useMemo(() => [
        { header: 'First Name', name: "firstName", buildField: rowData => <Input name="firstName" /> },
        { header: 'Last Name', name: "lastName", buildField: rowData => <Input name="lastName" /> },
        { header: 'Date of Birth', name: "dob", buildField: rowData => <Input type="date" name="dob" /> },
        { header: 'Gender', name: "gender", buildField: rowData => <Input name="gender" /> },
        { header: 'Email', name: "email", buildField: rowData => <Input name="email" /> },
        { header: 'Coins', name: "coins", buildField: rowData => <Input name="coins" /> },
        { header: 'Created Time', name: "createdTime", buildField: rowData => <Input name="createdTime" /> },
        {
            header: 'Status', name: 'active',
            buildField: rowData => <Select name="levelEnum" options={[{ value: 1, text: "True" }, { value: 0, text: "False" }]} />
        }
    ], []);

    // Properties of table row
    const userInfoRowProps = useMemo(() => {
        const statusButtonReplacedContent = (rowData) => <button name="active" plain={`${rowData['active']}`}
            onMouseEnter={(e) => {
                if (e.target.innerText.trim() == "Activating")  e.target.innerText = "Inactivate";
                else if (e.target.innerText.trim() == "Inactivated") e.target.innerText = "Activate";
            }}
            onMouseLeave={(e) => {
                if (e.target.innerText.trim() == "Activate")    e.target.innerText = "Inactivated";
                else if (e.target.innerText.trim() == "Inactivate")  e.target.innerText = "Activating";
            }}
            onClick={async (e) => {
                e.stopPropagation();
                await dispatch(
                    UserInfoAdminThunk.updateUserStatusThunk({ userId: rowData.userId, newStatus: !rowData.active })
                ).unwrap();
            }}>
            {rowData['active'] ? "Activating" : "Inactivated"}
        </button>

        //Handle open menu when right click
        const handleContextMenu = (e, rowData) => {
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
                                body: <SubscriptionsDialog userInfoId={rowData["userInfoId"]} />,
                            }),
                    },
                ],
            });
        };

        return {
            tableState: userInfoState,
            eventRegistered: rowData => ({
                onContextMenu: (e) => handleContextMenu(e, rowData)
            }),
            canSelectingRow: false,
            columns: [
                { header: 'First Name', name: 'firstName' },
                { header: 'Last Name', name: 'lastName' },
                { header: 'Date of Birth', name: 'dob' },
                { header: 'Gender', name: 'gender' },
                { header: 'Email', name: 'email' },
                { header: 'Coins', name: 'coins' },
                { header: 'Created Time', name: 'createdTime' },
                { header: 'Status', name: 'active', replacedContent: statusButtonReplacedContent }
            ],
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
        async function fetchData() {
            try {
                const { sortedField, sortedMode } = sortData || {};

                const objToGetData = {
                    page: currentPage,
                    filterFields: filterData,
                    sortedField: sortedField,
                    sortedMode: sortedMode,
                };
                console.log(objToGetData);
                await dispatch(UserInfoAdminThunk.getAllUserInfoThunk(objToGetData)).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        }
        fetchData();
    }, [dispatch, sortData, filterData, currentPage]);

    return userInfoState.loading ? (
        <div className="table-wrapper user-info-table">Loading Data...</div>
    ) : (
        <>
            <Table
                className="user-info-table"
                title="User Information"
                state={userInfoState}
                headers={userInfoHeaders}
                rowProps={userInfoRowProps}
                onFilter={handleFilter}
                onSort={handleSort}
                filterData={filterData}
                sortData={sortData}
                addRowProps={false}
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
