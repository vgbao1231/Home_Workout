import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormatterDict, Table } from "~/components/ui/Table/CustomTable";
import { DatalinesAdminThunk } from "~/redux/thunks/datalinesThunk";
import { addToast } from "~/redux/slices/toastSlice";
import { Dialog, Input, Select } from "~/components";
import Pagination from "~/components/ui/Table/Pagination/Pagination";
import "./DatasetTable.scss"
import { isAMultipleOf, isInteger, isNotNegative } from "~/utils/validators";
import SchedulePagesDialog from "../SchedulePagesDialog/SchedulePagesDialog";
import { ScheduleAdminService } from "~/services/scheduleService";
import { DatalinesAdminService } from "~/services/datalinesService";

export default function DatasetTable({ set_schedule_id }) {
    const dispatch = useDispatch();
    const datalines = useSelector(state => state.datalines);
    const genderData = useSelector(state => state.enum.data.genders);
    const [currentPage, setCurrentPage] = useState(1);
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const deleteButtonReplacedContent = useCallback((rowData) => <button type="button" name="deleteBtn" plain={`${rowData.id}`}
        onClick={async (e) => {
            e.stopPropagation();
            DatalinesAdminService.deleteDataLine(rowData.id)
                .then(response => {
                    dispatch(addToast(response.message, "success"));
                    dispatch(DatalinesAdminThunk.getDecisionScheduleDatasetThunk({ page: currentPage }));
                })
                .catch(error => dispatch(addToast(error.message, "error")))
        }}>Delete</button>
        , [dispatch, currentPage]);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: DatalinesAdminThunk.getDecisionScheduleDatasetThunk
            }
        },
        tableInfo: {
            columnsInfo: [
                FormatterDict.ColumnInfo('id', 'Id'),
                FormatterDict.ColumnInfo('age', 'Age'),
                FormatterDict.ColumnInfo('gender', 'Gender', null, rowData =>
                    <span className="gender" plain={rowData.gender === 1 ? "MALE" : "FEMALE"}>
                        {rowData.gender === 1 ? "MALE" : "FEMALE"}
                    </span>
                ),
                FormatterDict.ColumnInfo('weight', 'Weight'),
                FormatterDict.ColumnInfo('body_fat_threshold', 'Body Fat Threshold'),
                FormatterDict.ColumnInfo('session', 'Session'),
                FormatterDict.ColumnInfo('schedule_id', 'Schedule Id', null, rowData =>
                    <span className="schedule-id">{rowData.schedule_id}</span>),
                FormatterDict.ColumnInfo('delete_id', 'Delete Dataline', null, deleteButtonReplacedContent),
            ],
            filterFields: [
                FormatterDict.FilterField("Age", <Input type="number" name="age" />),
                FormatterDict.FilterField("Gender", <Select name="gender" options={genderData.map(dataObj => (
                    { value: dataObj.id, text: dataObj.raw }
                ))} />),
                FormatterDict.FilterField("Weight", <Input type="number" name="weight" />),
                FormatterDict.FilterField("Body Fat Threshold", <Input type="number" name="body_fat_threshold" />),
                FormatterDict.FilterField("Session", <Input type="number" name="session" />),
                FormatterDict.FilterField("Schedule Id", <Input type="number" name="schedule_id" />),
            ],
            sortingFields: [
                FormatterDict.SortingField('age', 'Age'),
                FormatterDict.SortingField('gender', 'Gender'),
                FormatterDict.SortingField('weight', 'Weight'),
                FormatterDict.SortingField('body_fat_threshold', 'Body Fat Threshold'),
                FormatterDict.SortingField('session', 'Session'),
                FormatterDict.SortingField('schedule_id', 'Schedule Id'),
            ],
        },
        reducers: {
            clickingRow: (e, rowData) => set_schedule_id(rowData.schedule_id),
            globalToastEngine: addToast
        }
    }), [deleteButtonReplacedContent, genderData, set_schedule_id]);

    const addingFormComponents = useMemo(() => FormatterDict.AddingField({
        inputCompos: [
            FormatterDict.AddingField(<Input type="number" name="age" placeholder="Age"
                validators={{ isInteger, isNotNegative }} required />),
            FormatterDict.AddingField(<Select name="gender" placeholder="Select Gender" options={genderData.map(dataObj => (
                { value: dataObj.id, text: dataObj.raw }
            ))} />),
            FormatterDict.AddingField(<Input type="number" name="weight" placeholder="Weight"
                validators={{ isInteger, isNotNegative }} required />),
            FormatterDict.AddingField(<Input type="number" name="body_fat_threshold" placeholder="Body Fat Threshold"
                validators={{ isAMultipleOf: isAMultipleOf(5), isInteger, isNotNegative }} required />),
            FormatterDict.AddingField(<span ><i>Don't Fill</i></span>),
            FormatterDict.AddingField(<span className="datalines_adding-form_schedule_id"
                onClick={e => {
                    console.log("Click")
                    setDialogProps({
                        isOpen: true, title: '',
                        body: <SchedulePagesDialog scheduleIdTag={e.target} rootDialogPropsSetter={setDialogProps} />
                    })
                }}
            >Select Schedule from dialog</span>),
        ],
        handleSubmit: async (formData, isPreventDefault) => {
            formData.schedule_id = Number.parseInt(document.querySelector("span.datalines_adding-form_schedule_id").textContent);
            if (isNaN(formData.schedule_id)) {
                dispatch(addToast("Schedule Id required to submit new dataline", "error"));
                isPreventDefault.status = true;
                return;
            }
            formData.session = await ScheduleAdminService.getSessionsQuantityOfSchedule(formData.schedule_id);
            formData.session = formData.session.data.sessionsQuantity;
            await dispatch(DatalinesAdminThunk.addDataLineThunk(formData)).unwrap();
        },
    }), [dispatch, genderData]);

    return (
        <div className="decision-schedule-dataset">
            <Table
                title="Decision Schedule Dataset"
                tableState={datalines}
                pageState={currentPage}
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                tableModes={FormatterDict.TableModes(false, false, false, true, false)}
            />
            <Pagination
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalPages={datalines.totalPages}
            />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}