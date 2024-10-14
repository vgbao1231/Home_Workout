import './Table.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TableRowBuilder from './TableRow/CustomTableRow';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, Pencil, Plus, Send, X } from 'lucide-react';
import Form from '../Form/Form';
import Select from '../Select/Select';
import ContextMenu from './ContextMenu/ContextMenu';

export const FormatterDict = {
    TableComponents({ 
        reduxInfo={
            GET_thunk:{ thunk(){}, moreParams:{} },
            GET_replacedAction:{ action(){}, moreParams:{} },
            UPDATE_thunk:{ thunk(){}, moreParams:{} },
            DELETE_thunk:{ thunk(){}, moreParams:{} }
        }, 
        tableInfo={ columnsInfo: [], filterFields: [], sortingFields: [] },
        reducers={
            selectingRows: { selectAllRows(){}, toggleSelectRow(){} },
            globalToastEngine() {}
        },
    }) {
        return { reduxInfo, tableInfo, reducers };
    },
    AddingFormComponents({ 
        reduxInfo={     
            POST_thunk:{ thunk(){}, moreParams:{} },
        }, 
        inputCompos=[],
        handleSubmit=()=>{}
    }) {
        return { reduxInfo, inputCompos, handleSubmit };
    },
    ContextMenuComponents({ menuItems=[] }) {
        return { menuItems };
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
    AddingField: (name = "name", inputCompo = (<></>)) => ({ name, inputCompo }),
}

// export function Table2({ className, headers, title, state, rowProps, addRowProps, onFilter, onSort, filterData, sortData }) {
export function Table({ className, title, tableState, pageState, tableComponents, addingFormComponents, contextMenuComponents, tableModes }) {
    console.log('table');
    
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
    const handleSort = useCallback((sortData) => setSortData(sortData), [])
    const handleSelectAll = useCallback((e) =>
        dispatch(tableComponents.reducers.selectingRows.selectAllRows(e.target.checked))
    , [dispatch]);

    const handleSelectingRow = useCallback((_, rowData) => {
        if (rowData[primaryKey] !== updatingRowId)
            dispatch(tableComponents.reducers.selectingRows.toggleSelectRow(rowData[primaryKey]));
    }, [updatingRowId]);
    
    const handleContextMenu = useCallback((e, rowData) => {
        e.preventDefault();
        setContextMenu({
            isShown: true,
            x: e.pageX,
            y: e.pageY,
            menuItems: tableModes.canUpdatingRow
                ? [...(contextMenuComponents.menuItems ? contextMenuComponents.menuItems : []), {
                    text: 'Update Row Info', icon: <Pencil />, action: () => setUpdatingRowId(rowData[primaryKey])
                }] : (contextMenuComponents.menuItems ? contextMenuComponents.menuItems : []),
        });
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
        if(tableComponents.GET_replacedAction)  getData();
        else    fetchData();
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
            <div className={`table-wrapper ${className}`}>
                <div className="table-feature">
                    <div className="table-title">{title}</div>
                    <div className="table-tool center">
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
                    </div>
                </div>
                <div className="table-header">
                    <div className="table-row">
                        {tableModes.canSelectingRow && //--Adding selecting Checkbox into Header
                            <div className="table-cell">
                                <input
                                    type="checkbox"
                                    checked={data.every((rowData) => selectedRows[rowData[primaryKey]])}
                                    onChange={handleSelectAll}
                                />
                            </div>}
                        {tableComponents.tableInfo.columnsInfo.map((columnInfo, index) => (
                            <div key={index} className="table-cell">
                                {columnInfo.headerLabel}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="table-body">
                    {data.map((rowData, index) => {
                        return <TableRowBuilder
                            key={index}
                            rowData={rowData}
                            primaryKeyName={primaryKey}
                            columnsInfo={tableComponents.tableInfo.columnsInfo}
                            selectedRows={tableModes.canSelectingRow ? selectedRows : null}
                            handleSelectRow={tableModes.canSelectingRow ? handleSelectingRow : null}
                            updatingRowIdState={tableModes.canUpdatingRow ? updatingRowId : null}
                            handleContextMenu={tableModes.hasContextMenu ? handleContextMenu : null}
                        />;
                    })}
                    {tableModes.hasAddingForm && (isAddingRow ? (
                        <Form
                            ref={addRowRef}
                            className="table-row add-row"
                            onSubmit={(formData) => {
                                if (addingFormComponents.handleSubmit)
                                    addingFormComponents.handleSubmit(formData);
                                else
                                //--Adding reduxInfo.moreParams into formData.
                                    addingFormComponents.reduxInfo.POST_thunk(formData);
                                setIsAddingRow(false);
                            }}
                        >
                            <div className="table-cell">
                                <Send className="send-icon" onClick={() => addRowRef.current.requestSubmit()} />
                            </div>
                            {tableModes.hasAddingForm &&
                                addingFormComponents.inputCompos.map((inputCompo, index) =>
                                    <div className="table-cell" key={index}> {inputCompo} </div>
                            )}
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