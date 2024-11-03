import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from 'lucide-react';
import { UserInfoAdminThunk } from '~/redux/thunks/userInfoThunk';
import { addToast } from '~/redux/slices/toastSlice';
import SubscriptionsDialog from './SubscriptionsDialog/SubscriptionsDialog';
import { Dialog, Input, Select } from '~/components';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import './UserInfoTable.scss';
import { FormatterDict, Table } from '~/components/ui/Table/CustomTable';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';

export default function UserInfoTable() {
    const dispatch = useDispatch()
    const userInfoState = useSelector((state) => state.userInfo);
    const genderData = useSelector((state) => state.enum.data.genders);
    const [contextMenu, setContextMenu] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const statusButtonReplacedContent = useCallback((rowData) => <button name="active" plain={`${rowData['active']}`}
        onMouseEnter={(e) => {
            if (e.target.innerText.trim() == "Activating") e.target.innerText = "Inactivate";
            else if (e.target.innerText.trim() == "Inactivated") e.target.innerText = "Activate";
        }}
        onMouseLeave={(e) => {
            if (e.target.innerText.trim() == "Activate") e.target.innerText = "Inactivated";
            else if (e.target.innerText.trim() == "Inactivate") e.target.innerText = "Activating";
        }}
        onClick={async (e) => {
            e.stopPropagation();
            await dispatch(
                UserInfoAdminThunk.updateUserStatusThunk({ userId: rowData.userId, newStatus: !rowData.active })
            ).unwrap();
        }}>
        {rowData['active'] ? "Activating" : "Inactivated"}
    </button>, []);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: UserInfoAdminThunk.getAllUserInfoThunk
            }
        },
        tableInfo: {
            columnsInfo: [
                FormatterDict.ColumnInfo('firstName', 'First Name'),
                FormatterDict.ColumnInfo('lastName', 'Last Name'),
                FormatterDict.ColumnInfo('dob', 'Date of Birth'),
                FormatterDict.ColumnInfo('gender', 'Gender'),
                FormatterDict.ColumnInfo('email', 'Email'),
                FormatterDict.ColumnInfo('coins', 'Coins'),
                FormatterDict.ColumnInfo('createdTime', 'Created Time'),
                FormatterDict.ColumnInfo('active', 'Status', null, statusButtonReplacedContent)
            ],
            filterFields: [
                FormatterDict.FilterField("First Name", <Input name="fisrtName" />),
                FormatterDict.FilterField("Last Name", <Input name="lastName" />),
                FormatterDict.FilterField("From Date of Birth", <Input type="date" name="fromDob" />),
                FormatterDict.FilterField("To Date of Birth", <Input type="date" name="toDob" />),
                FormatterDict.FilterField("Gender", <Select name="genderId" options={genderData.map(dataObj => (
                    { value: dataObj["id"], text: dataObj["raw"] }
                ))} />),
                FormatterDict.FilterField("Email", <Input name="email" />),
                FormatterDict.FilterField("Coins", <Input type="number" name="coins" />),
                FormatterDict.FilterField("From Created Time", <Input type="datetime-local" name="fromCreatedTime" />),
                FormatterDict.FilterField("To Created Time", <Input type="datetime-local" name="toCreatedTime" />),
                FormatterDict.FilterField("Active Status", <Select name="active" options={
                    [{ value: true, text: "Activating" }, { value: false, text: "Deactivated" },]
                } />),
            ],
            sortingFields: [
                FormatterDict.SortingField('firstName', 'First Name'),
                FormatterDict.SortingField('lastName', 'Last Name'),
                FormatterDict.SortingField('dob', 'Date of Birth'),
                FormatterDict.SortingField('gender', 'Gender'),
                FormatterDict.SortingField('email', 'Email'),
                FormatterDict.SortingField('coins', 'Coins'),
                FormatterDict.SortingField('createdTime', 'Created Time'),
                FormatterDict.SortingField('active', 'Status')
            ],
        },
        reducers: {
            globalToastEngine: addToast
        }
    }), []);

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        rowData => ({
            text: 'Show Subscriptions',
            icon: <Book />,
            action: () =>
                setDialogProps({
                    isOpen: true,
                    title: '',
                    className: 'subscriptions-dialog',
                    body: <SubscriptionsDialog userInfoId={rowData["userInfoId"]} />,
                }),
        }),
    ]), []);

    return (
        <div className="user-info-table">
            <Table
                title="User Information"
                tableState={userInfoState}
                pageState={currentPage}
                tableComponents={tableComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, true)}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={userInfoState.totalPages}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}