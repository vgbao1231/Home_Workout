import './Table.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableRowBuilder from './TableRow/CustomTableRow';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, Pencil, Plus, Send, X } from 'lucide-react';
import Form from '../Form/Form';
import Select from '../Select/Select';
import ContextMenu from './ContextMenu/ContextMenu';
import { addToast } from '~/redux/slices/toastSlice';

export const FormatterDict = {
    TableComponents({
        reduxInfo = {
            GET_thunk: { thunk() { }, moreParams: {} },
            GET_replacedAction: { action() { }, moreParams: {} },
            UPDATE_thunk: { thunk() { }, moreParams: {} },
            DELETE_thunk: { thunk() { }, moreParams: {} }
        },
        tableInfo = { columnsInfo: [], filterFields: [], sortingFields: [], offHeaders: false },
        reducers = {
            selectingRows: { selectAllRows() { }, toggleSelectRow() { } },
            clickingRow() { },
            globalToastEngine() { }
        },
    }) {
        return { reduxInfo, tableInfo, reducers };
    },
    AddingFormComponents({
        reduxInfo = {
            POST_thunk: { thunk() { }, moreParams: {} },
        },
        inputCompos = [],
        handleSubmit = null
    }) {
        return { reduxInfo, inputCompos, handleSubmit };
    },
    ContextMenuComponents(menuBuilders = []) {
        return { menuBuilders };
    },
    TableModes(canSelectingRow = false, canUpdatingRow = false, canDeletingRow = false, hasAddingForm = false,
        hasContextMenu = false) {
        return { canSelectingRow, canUpdatingRow, canDeletingRow, hasAddingForm, hasContextMenu };
    },
    ColumnInfo(name = "Name", headerLabel = "Header Label", updatingFieldBuilder, replacedContent) {
        return { name, headerLabel, updatingFieldBuilder, replacedContent };
    },
    FilterField: (name = "name", inputCompo = (<></>)) => ({ name, inputCompo }),
    SortingField: (name = "name", sortingLabel = "Name") => ({ name, sortingLabel }),
    AddingField: (inputCompo = (<></>)) => inputCompo,
}

export function Table({ title, tableState, pageState, tableComponents, addingFormComponents, contextMenuComponents, tableModes }) {
    console.log("table")
    const dispatch = useDispatch();
    const { data, selectedRows } = useMemo(() => tableState, [tableState]);
    const { primaryKey } = useMemo(() => tableState, []);
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const [filterData, setFilterData] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortData, setSortData] = useState(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const [contextMenu, setContextMenu] = useState({});
    const addRowRef = useRef();

    const handleFilter = useCallback((filterData) => {
        filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));
        setFilterData(filterData);
    }, []);
    const handleSort = useCallback((data) => setSortData(data), [])
    const handleSelectAll = useCallback((e) => {
        dispatch(tableComponents.reducers.selectingRows.selectAllRows({ page: pageState }));
    }, [dispatch, pageState]);
    const handleSelectingRow = useCallback((e, rowData) => {
        dispatch(tableComponents.reducers.selectingRows.toggleSelectRow({ page: pageState, rowData }));
    }, [dispatch, updatingRowId, pageState, tableState]);

    const handleContextMenu = useCallback((e, rowData) => {
        e.preventDefault();
        if (!contextMenuComponents.menuBuilders)
            contextMenuComponents.menuBuilders = []
        if (tableModes.canUpdatingRow)
            contextMenuComponents.menuBuilders.push(
                rowData => ({ text: 'Update Row Info', icon: <Pencil />, action: () => setUpdatingRowId(rowData[primaryKey]) })
            );
        setContextMenu({
            isShown: true,
            x: e.pageX,
            y: e.pageY,
            menuItems: contextMenuComponents.menuBuilders.map(menuContextBuilder => menuContextBuilder(rowData))
        });
    }, []);

    const handleSubmitAddingForm = useCallback(formData => {
        const isPreventDefault = { status: false };
        if (addingFormComponents.handleSubmit)
            addingFormComponents.handleSubmit(formData, isPreventDefault);
        else {
            if (addingFormComponents.reduxInfo.POST_thunk.moreParams)
                formData = { ...formData, ...addingFormComponents.reduxInfo.POST_thunk.moreParams };
            dispatch(addingFormComponents.reduxInfo.POST_thunk.thunk(formData));
        }
        !isPreventDefault.status && setIsAddingRow(false);
        dispatch(addToast("Adding successfully!", "success"));
    }, []);

    useEffect(() => {
        function getData() {
            const params = tableComponents.reduxInfo.GET_replacedAction.moreParams;
            tableComponents.reduxInfo.GET_replacedAction.action(params);
        }
        async function fetchData() {
            try {
                const { sortedField, sortedMode } = sortData || {};
                const objToGetData = {
                    page: pageState,
                    filterFields: filterData,
                    sortedField: sortedField,
                    sortedMode: sortedMode,
                    ...tableComponents.reduxInfo.GET_thunk.moreParams
                };
                await dispatch(tableComponents.reduxInfo.GET_thunk.thunk(objToGetData)).unwrap();
            } catch (error) {
                dispatch(tableComponents.reducers.globalToastEngine(error, 'error'));
            }
        };
        if (tableComponents.GET_replacedAction) getData();
        else fetchData();
    }, [dispatch, sortData, filterData, pageState]);

    useEffect(() => {
        if (tableModes.hasAddingForm && isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape')
                    setIsAddingRow(false); // Turn off adding mode
            };
            window.addEventListener('keydown', handleKeyDown);

            // Cleanup when component unmount or isAddingRow is false
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isAddingRow]);
    
    return (
        <>
            <div className="table-wrapper">
                <div className="table-feature">
                    <div className="table-title">{title}</div>
                    <div className="table-tool center">
                        {tableComponents.tableInfo.filterFields &&
                            <div className="tool-button">
                                <ListFilter className="tool-icon" onClick={() => setIsFilterOpen(!isFilterOpen)} />
                                <Form
                                    className={`filter-box${isFilterOpen ? ' open' : ''}`}
                                    onSubmit={handleFilter}
                                    defaultValues={filterData}
                                >
                                    <div className="filter-header">
                                        <span>Filter</span>
                                        <X onClick={() => setIsFilterOpen(!isFilterOpen)} />
                                    </div>
                                    <div className="filter-body">
                                        {tableComponents.tableInfo.filterFields.map((filterField, index) => (
                                            <div key={index} className="filter-criteria">
                                                <span>{filterField.name}</span>
                                                {filterField.inputCompo}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="filter-footer">
                                        <ListFilter />
                                        <span>Confirm</span>
                                    </button>
                                </Form>
                                {isFilterOpen && (
                                    <div className="filter-overlay" onClick={() => setIsFilterOpen(!isFilterOpen)}></div>
                                )}
                            </div>
                        }
                        {tableComponents.tableInfo.sortingFields &&
                            <div className="tool-button">
                                <ArrowDownUp className="tool-icon" onClick={() => setIsSortOpen(!isSortOpen)} />
                                <Form
                                    className={`sort-box${isSortOpen ? ' open' : ''}`}
                                    onSubmit={handleSort}
                                    defaultValues={sortData}
                                >
                                    <div className="sort-header">
                                        <span>Sort</span>
                                        <X onClick={() => setIsSortOpen(!isSortOpen)} />
                                    </div>
                                    <div className="sort-body">
                                        <div className="sort-criteria">
                                            <Select
                                                name="sortedField"
                                                placeholder="Field"
                                                options={tableComponents.tableInfo.sortingFields.map((columnInfo) => (
                                                    { value: columnInfo.name, text: columnInfo.sortingLabel }
                                                ))}
                                            />
                                            <Select
                                                name="sortedMode"
                                                placeholder="Mode"
                                                options={[
                                                    { value: 1, text: 'Ascending' },
                                                    { value: -1, text: 'Descending' },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <button className="sort-footer">
                                        <ArrowDownUp />
                                        <span>Confirm</span>
                                    </button>
                                </Form>
                                {isSortOpen && <div className="sort-overlay" onClick={() => setIsSortOpen(!isSortOpen)}></div>}
                            </div>
                        }
                    </div>
                </div>
                <div className="table-header">
                    <div className="table-row">
                        {tableModes.canSelectingRow && //--Adding selecting Checkbox into Header
                            <div className="table-cell">
                                <input
                                    type="checkbox"
                                    checked={!!selectedRows[pageState] && data.length === Object.keys(selectedRows[pageState]).length}
                                    onChange={handleSelectAll}
                                />
                            </div>}
                        {!tableComponents.tableInfo.offHeaders &&
                            tableComponents.tableInfo.columnsInfo.map((columnInfo, index) => (
                                <div key={index} className="table-cell">
                                    {columnInfo.headerLabel}
                                </div>
                        ))}
                    </div>
                </div>
                <div className="table-body">
                    {tableState.loading
                        ? <div className="table-body-loading">Loading...</div>
                        : data.map((rowData, index) => {
                            return <TableRowBuilder
                                key={index}
                                rowData={rowData}
                                primaryKeyName={primaryKey}
                                currentPage={pageState}
                                columnsInfo={tableComponents.tableInfo.columnsInfo}
                                selectedRows={tableModes.canSelectingRow ? selectedRows : null}
                                handleSelectingRow={tableModes.canSelectingRow ? handleSelectingRow : null}
                                handleClickingRow={tableComponents.reducers && tableComponents.reducers.clickingRow
                                    ? tableComponents.reducers.clickingRow : null}
                                updatingRowIdState={tableModes.canUpdatingRow ? updatingRowId : null}
                                handleContextMenu={tableModes.hasContextMenu ? handleContextMenu : null}
                            />;
                        })
                    }
                    {tableModes.hasAddingForm && (isAddingRow ? (
                        <Form ref={addRowRef} className="table-row add-row" onSubmit={(formData) => handleSubmitAddingForm(formData)}>
                            <div className="table-cell">
                                <Send className="send-icon" onClick={() => addRowRef.current.requestSubmit()} />
                            </div>
                            {tableModes.hasAddingForm &&
                                addingFormComponents.inputCompos.map((inputCompo, index) =>
                                    <div className="table-cell" key={index}> {inputCompo} </div>)}
                        </Form>
                    ) : (
                        <div className="table-row add-row" onClick={() => setIsAddingRow(true)}>
                            <div className="table-cell">
                                <Plus />
                            </div>
                            <div className="table-cell">Add row</div>
                        </div>
                    ))}
                </div>
            </div>
            {tableModes.hasContextMenu
                ? <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
                : <></>
            }
        </>
    );
}