import { useSelector } from 'react-redux';
import './SchedulesList.scss';
import { useCallback, useMemo, useState } from 'react';
import { FormatterDict, Table } from '~/components/ui/Table/CustomTable';
import { addToast } from '~/redux/slices/toastSlice';
import Pagination from '~/components/ui/Table/Pagination/Pagination';
import { Dialog, Input, Select } from '~/components';
import ScheduleInfoDialog from '../ScheduleInfoDialog/ScheduleInfoDialog';
import { ScheduleUserThunk } from '~/redux/thunks/scheduleThunk';

export default function SchedulesList() {
    const scheduleData = useSelector(state => state.schedule);
    const levelData = useSelector((state) => state.enum.data.levels);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ dialogProps, setDialogProps ] = useState({ isOpen: false, title: '', body: null });

    const handleClickSchedule = useCallback((e, rowData) => {
        setDialogProps({
            isOpen: true,
            title: 'Schedule Information',
            body: <ScheduleInfoDialog scheduleId={rowData.scheduleId}/>
        });
    }, []);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: ScheduleUserThunk.getAvailableSchedulesOfUser
            }
        },
        tableInfo: {
            offHeaders: true,
            columnsInfo:[
                FormatterDict.ColumnInfo('name'),
                FormatterDict.ColumnInfo('description'),
                FormatterDict.ColumnInfo('levelEnum', null, null, rowData =>
                    <span plain={rowData.levelEnum}>{rowData.levelEnum}</span>
                ),
                FormatterDict.ColumnInfo('coins', null, null, rowData =>
                    <span plain={rowData.coins}>{rowData.coins}</span>
                ),
            ],
            filterFields:[
                FormatterDict.FilterField("From Coins", <Input type="number" name="fromCoins" />),
                FormatterDict.FilterField("To Coins", <Input type="number" name="toCoins" />),
                FormatterDict.FilterField("Level", <Select placeholder="Select Level" name="level"
                    options={levelData.map(level => ({ value: level.level, text: level.name }))} />),
            ],
            sortingFields:[
                FormatterDict.SortingField('coins', 'Coins'),
                FormatterDict.SortingField('levelEnum', 'Level'),
            ],
        },
        reducers: {
            clickingRow: handleClickSchedule,
            globalToastEngine: addToast
        }
    }), []);

    return (
        <div className="available-schedules-list">
            <Table

                title="Available Schedules"
                tableState={scheduleData}
                pageState={currentPage}
                tableComponents={tableComponents}
                tableModes={FormatterDict.TableModes(false, false, false, false, false)}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={scheduleData.totalPages}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );

}