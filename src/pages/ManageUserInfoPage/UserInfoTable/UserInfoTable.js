import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Book } from 'lucide-react';
import { UserInfoAdminThunk } from '~/redux/thunks/userInfoThunk';
import { addToast } from '~/redux/slices/toastSlice';
import SubscriptionsDialog from './SubscriptionsDialog/SubscriptionsDialog';
import { Dialog, Input, Select, Table } from '~/components';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import './UserInfoTable.scss';
import { FormatterDict } from '~/components/ui/Table/CustomTable';

export default function UserInfoTable({ userInfoId }) {
    const dispatch = useDispatch()
    const userInfoState = useSelector((state) => state.userInfo);
    const genderData = useSelector((state) => state.enum.data.genders);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const statusButtonReplacedContent = useCallback((rowData) => <button name="active" plain={`${rowData['active']}`}
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
    </button>, []);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: UserInfoAdminThunk.getAllUserInfoThunk
            }
        },
        tableInfo: {
            columnsInfo:[
                FormatterDict.ColumnInfo('firstName', 'First Name' ),
                FormatterDict.ColumnInfo('lastName', 'Last Name' ),
                FormatterDict.ColumnInfo('dob', 'Date of Birth' ),
                FormatterDict.ColumnInfo('gender', 'Gender' ),
                FormatterDict.ColumnInfo('email', 'Email' ),
                FormatterDict.ColumnInfo('coins', 'Coins' ),
                FormatterDict.ColumnInfo('createdTime', 'Created Time' ),
                FormatterDict.ColumnInfo('active', 'Status', null, statusButtonReplacedContent )
            ],
            filterFields:[
                FormatterDict.FilterField("First Name", <Input name="fisrtName" />),
                FormatterDict.FilterField("Last Name", <Input name="lastName" />),
                FormatterDict.FilterField("From Date of Birth", <Input type="datetime-local" name="fromDob" />),
                FormatterDict.FilterField("To Date of Birth", <Input type="datetime-local" name="toDob" />),
                FormatterDict.FilterField("Gender", <Input type="datetime-local" name="toSubscribedTime" />),
                FormatterDict.FilterField("Email", <Input name="email" />),
                FormatterDict.FilterField("Coins", <Input type="number" name="coins" />),
                FormatterDict.FilterField("From Created Time", <Input type="datetime-local" name="fromCreatedTime" />),
                FormatterDict.FilterField("To Created Time", <Input type="datetime-local" name="toCreatedTime" />),
                FormatterDict.FilterField("Active Status", <Select name="active" options={genderData.map(dataObj => ({
                    value: dataObj["id"], text: dataObj["gender"]
                }))}/>),
            ],
            sortingFields:[
                FormatterDict.SortingField('firstName', 'First Name' ),
                FormatterDict.SortingField('lastName', 'Last Name' ),
                FormatterDict.SortingField('dob', 'Date of Birth' ),
                FormatterDict.SortingField('gender', 'Gender' ),
                FormatterDict.SortingField('email', 'Email' ),
                FormatterDict.SortingField('coins', 'Coins' ),
                FormatterDict.SortingField('createdTime', 'Created Time' ),
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
                    body: <SubscriptionsDialog userInfoId={rowData["userInfoId"]} />,
                }),
        })
    ]), []);

    return (
        <>
            <Table
                className="user-info-page"
                title="User Information"
                tableState={userInfoState}
                pageState={currentPage}
                tableComponents={tableComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={userInfoState.totalPages}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </>
    );
}