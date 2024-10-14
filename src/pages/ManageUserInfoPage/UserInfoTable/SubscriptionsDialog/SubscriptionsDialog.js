import { useSelector } from 'react-redux';
import './SubscriptionsDialog.scss';
import { SubscriptionAdminThunk } from '~/redux/thunks/subscriptionThunk';
import { Input } from '~/components';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import { addToast } from '~/redux/slices/toastSlice';
import { Table, FormatterDict } from '~/components/ui/Table/CustomTable';
import { useMemo } from 'react';

export default function SubscriptionsDialog({ userInfoId }) {
    const subscriptionsState = useSelector((state) => state.subscription)
    const [currentPage, setCurrentPage] = useState(1);

    const tableComponents = useMemo(() => FormatterDict.TableComponent(
        columnsInfo = [
            FormatterDict.ColumnInfo("firstName", "First Name"),
            FormatterDict.ColumnInfo("lastName", "Last Name"),
            FormatterDict.ColumnInfo("subscribedTime", "Subscribed Time"),
            FormatterDict.ColumnInfo("efficientDays", "Efficient Days"),
            FormatterDict.ColumnInfo("scheduleName", "Schedule Name"),
            FormatterDict.ColumnInfo("scheduleCoins", "Schedule Coins"),
            FormatterDict.ColumnInfo("completedTime", "Completed Time"),
        ],
        filterFields = [
            FormatterDict.FilterField("firstName", <Input name="fisrtName" />),
            FormatterDict.FilterField("lastName", <Input name="lastName" />),
            FormatterDict.FilterField("fromSubscribedTime", <Input type="datetime-local" name="fromSubscribedTime" />),
            FormatterDict.FilterField("toSubscribedTime", <Input type="datetime-local" name="toSubscribedTime" />),
            FormatterDict.FilterField("efficientDays", <Input type="number" name="efficientDays" />),
            FormatterDict.FilterField("scheduleName", <Input name="scheduleName" />),
            FormatterDict.FilterField("scheduleCoins", <Input type="number" name="scheduleCoins" />),
            Formatte    rDict.FilterField("fromCompletedTime", <Input type="datetime-local" name="fromCompletedTime" />),
            FormatterDict.FilterField("toCompletedTime", <Input type="datetime-local" name="toCompletedTime" />),
        ],
        sortingFields = [
            FormatterDict.SortingField("firstName", "First Name"),
            FormatterDict.SortingField("lastName", "Last Name"),
            FormatterDict.SortingField("subscribedTime", "Subscribed Time"),
            FormatterDict.SortingField("efficientDays", "Efficient Days"),
            FormatterDict.SortingField("scheduleName", "Schedule Name"),
            FormatterDict.SortingField("scheduleCoins", "Schedule Coins"),
            FormatterDict.SortingField("completedTime", "Completed Time"),
        ], 
        //--Adding Form Fields(name,inputCompo)
        //--Context Menu Items()
    ), []);

    const tableStates = useMemo(() => FormatterDict.TableStates(
        subscriptionsState, currentPage, addToast,
        {
            moreParams: { id: userInfoId },
            GET_thunk: SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk,
        }
    ), []);

    const tableModes = useMemo(() => FormatterDict.TableModes(false, false, false, false), []);

    return (
        <>
            <Table
                className="user-info-table"
                title="User Information"
                tableComponents={{ ...tableComponents }}
                tableStates={{ ...tableStates }}
                tableModes={{ ...tableModes }}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={subscriptionsState.totalPages}
            />
        </>
    );
}