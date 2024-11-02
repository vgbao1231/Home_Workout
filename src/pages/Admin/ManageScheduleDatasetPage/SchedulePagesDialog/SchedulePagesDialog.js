import { FormatterDict, Table } from "~/components/ui/Table/CustomTable";
import "./SchedulePagesDialog.scss";
import { ScheduleAdminThunk } from "~/redux/thunks/scheduleThunk";
import { Dialog, Input, Select } from "~/components";
import { isInteger, isNotNegative } from "~/utils/validators";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";
import { addToast } from "~/redux/slices/toastSlice";
import Pagination from "~/components/ui/Table/Pagination/Pagination";
import { Book } from "lucide-react";
import ScheduleInfo from "../ScheduleInfo/ScheduleInfo";

export default function SchedulePagesDialog({ scheduleIdTag, rootDialogPropsSetter }) {
    const scheduleState = useSelector((state) => state.schedule);
    const levelData = useSelector((state) => state.enum.data.levels);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dialogProps, setDialogProps ] = useState({ isOpen: false, title: '', body: null });

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: ScheduleAdminThunk.fetchScheduleThunk
            }
        },
        tableInfo: {
            columnsInfo:[
                FormatterDict.ColumnInfo('name', 'Name'),
                FormatterDict.ColumnInfo('description', 'Discription'),
                FormatterDict.ColumnInfo('levelEnum', 'Level', null, rowData =>
                    <span plain={rowData.levelEnum} className="level-enum">{rowData.levelEnum}</span>),
                FormatterDict.ColumnInfo('coins', 'Coins', null, rowData =>
                    <span className="coins">{rowData.coins}$</span>),
            ],
            filterFields:[
                FormatterDict.FilterField("Name", <Input name="name" />),
                FormatterDict.FilterField("Description", <Input name="description" />),
                FormatterDict.FilterField("Level", <Select name="level" options={levelData.map(dataObj => (
                    { value: dataObj.value, text: dataObj.raw }
                ))} />),
                FormatterDict.FilterField("Coins", <Input type="number" name="coins" validators={{ isNotNegative, isInteger }}/>),
            ],
            sortingFields:[
                FormatterDict.SortingField('name', 'Name'),
                FormatterDict.SortingField('description', 'Description'),
                FormatterDict.SortingField('levelEnum', 'Level Enum'),
                FormatterDict.SortingField('coins', 'Coins'),
            ],
        },
        reducers: {
            clickingRow: (e, rowData) => {
                scheduleIdTag.innerText = rowData.scheduleId;
                rootDialogPropsSetter(prev => ({
                    ...prev,
                    isOpen: false
                }));
            },
            globalToastEngine: addToast
        }
    }), [levelData, rootDialogPropsSetter]);
    
    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        rowData => ({
            text: 'Show Schedule',
            icon: <Book />,
            action: () =>
                setDialogProps({
                    isOpen: true,
                    title: '',
                    body: <ScheduleInfo schedule_id={rowData.scheduleId} />,
                }),
        }),
    ]), []);

    return <>
        <Table
            className="schedule-table-dialog"
            title="Schedule Table Dialog"
            tableState={scheduleState}
            pageState={currentPage}
            tableComponents={tableComponents}
            contextMenuComponents={contextMenuComponents}
            tableModes={FormatterDict.TableModes(false, false, false, false, true)}
        />
        <Pagination
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={scheduleState.totalPages}
        />
        <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
    </>;
}