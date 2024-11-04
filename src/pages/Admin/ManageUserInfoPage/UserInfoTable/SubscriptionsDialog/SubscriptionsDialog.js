import { useSelector } from 'react-redux';
import './SubscriptionsDialog.scss';
import { SubscriptionAdminThunk } from '~/redux/thunks/subscriptionThunk';
import { Input } from '~/components';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import { addToast } from '~/redux/slices/toastSlice';
import { Table, FormatterDict } from '~/components/ui/Table/CustomTable';
import { useMemo, useState } from 'react';

export default function SubscriptionsDialog({ userInfoId }) {
    const subscriptionsState = useSelector((state) => state.subscription)
    const [currentPage, setCurrentPage] = useState(1);
    console.log("Dialog")
    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                moreParams: { id: userInfoId },
                thunk: SubscriptionAdminThunk.getAllSubscriptionByUserInfoThunk
            }
        },
        tableInfo: {
            columnsInfo: [
                FormatterDict.ColumnInfo("firstName", "First Name"),
                FormatterDict.ColumnInfo("lastName", "Last Name"),
                FormatterDict.ColumnInfo("subscribedTime", "Subscribed Time"),
                FormatterDict.ColumnInfo("efficientDays", "Efficient Days"),
                FormatterDict.ColumnInfo("scheduleName", "Schedule Name"),
                FormatterDict.ColumnInfo("scheduleCoins", "Schedule Coins"),
                FormatterDict.ColumnInfo("completedTime", "Completed Time"),
            ],
            filterFields: [
                FormatterDict.FilterField("First Name", <Input name="fisrtName" />),
                FormatterDict.FilterField("Last Name", <Input name="lastName" />),
                FormatterDict.FilterField("From Subscribed Time", <Input type="datetime-local" name="fromSubscribedTime" />),
                FormatterDict.FilterField("To Subscribed Time", <Input type="datetime-local" name="toSubscribedTime" />),
                FormatterDict.FilterField("Efficient Days", <Input type="number" name="efficientDays" />),
                FormatterDict.FilterField("Schedule Name", <Input name="scheduleName" />),
                FormatterDict.FilterField("From Coins", <Input type="number" name="fromCoins" />),
                FormatterDict.FilterField("To Coins", <Input type="number" name="toCoins" />),
                FormatterDict.FilterField("From Completed Time", <Input type="datetime-local" name="fromCompletedTime" />),
                FormatterDict.FilterField("To Completed Time", <Input type="datetime-local" name="toCompletedTime" />),
            ],
            sortingFields: [
                FormatterDict.SortingField("firstName", "First Name"),
                FormatterDict.SortingField("lastName", "Last Name"),
                FormatterDict.SortingField("subscribedTime", "Subscribed Time"),
                FormatterDict.SortingField("efficientDays", "Efficient Days"),
                FormatterDict.SortingField("name", "Schedule Name"),
                FormatterDict.SortingField("coins", "Schedule Coins"),
                FormatterDict.SortingField("completedTime", "Completed Time"),
            ],
        },
        reducers: {
            globalToastEngine: addToast
        }
    }), []);

    return (
        <>
            <Table
                title="Subscriptions"
                tableState={subscriptionsState}
                pageState={currentPage}
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={subscriptionsState.totalPages}
            />
        </>
    );
}