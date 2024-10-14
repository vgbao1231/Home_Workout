import './Table.scss';
import { selectAllRows } from '~/redux/slices/exerciseSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import TableRow from './TableRow/TableRow';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, Plus, Send, X } from 'lucide-react';
import Form from '../Form/Form';
import Select from '../Select/Select';

export const FormatterDict = {
    TableStates(mainState = null, page = null, toastEngine = () => { },
        reduxPair = {
            moreParams: {},
            GET_thunk() { },
            UPDATE_thunk() { },
            POST_thunk() { },
            DELETE_thunk() { }
        }
    ) {
        return { reduxPair, mainState, page, sortingPair, filterPair, toastEngine };
    },
    TableModes(canSelectingRow = false, canUpdatingRow = false, hasAddingForm = false, contextMenu = false) {
        return { canSelectingRow, canUpdatingRow, hasAddingForm, contextMenu };
    },
    TableComponent(columnsInfo = [], filterFields = [], sortingFields = [],
        addingFormFields = {
            handleSubmit() { },
            inputCompos: []
        }) {
        return { columnsInfo, filterFields, sortingFields, addingFormFields };
    },
    ColumnInfo(
        name = "Name",
        headerLabel = "Header Label",
        updatingFieldBuilder = () => { },
        replacedContent = () => { }
    ) {
        return { name, headerLabel, updatingFieldBuilder, replacedContent };
    },
    FilterField: (name = "name", inputCompo = (<></>)) => ({ name, inputCompo }),
    SortingField: (name = "name", sortingLabel = "Name") => ({ name, sortingLabel }),
}

// export function Table2({ className, headers, title, state, rowProps, addRowProps, onFilter, onSort, filterData, sortData }) {
export function Table2({ className, title, tableComponents, tableStates, tableModes }) {
    console.log('table');

    const dispatch = useDispatch();
    const { data, selectedRows, primaryKey } = tableStates.mainState;
    const [filterData, setFilterData] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortData, setSortData] = useState(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const addRowRef = useRef();

    const handleFilter = useCallback((filterData) => {
        filterData = Object.fromEntries(Object.entries(filterData).filter(([_, value]) => value.length > 0));
        setFilterData(filterData);
    }, []);
    const handleSort = useCallback((sortData) => setSortData(sortData), [])
    const handleSelectAll = useCallback((e) => {
        dispatch(selectAllRows(e.target.checked));
    }, [dispatch]);

    useEffect(() => {
        async function fetchData() {
            try {
                const { sortedField, sortedMode } = sortData || {};
                const objToGetData = {
                    page: currentPage,
                    filterFields: filterData,
                    sortedField: sortedField,
                    sortedMode: sortedMode,
                    ...tableStates.reduxPair.moreParams
                };
                await dispatch(tableStates.reduxPair.GET_thunk(objToGetData)).unwrap();
            } catch (error) {
                dispatch(tableStates.toastEngine(error, 'error'));
            }
        };
        fetchData();
    }, [dispatch, sortData, filterData, tableStates.page]);

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
                                {tableComponents.filterFields.map((filterField, index) => (
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
                                        options={tableComponents.sortingFields.map((columnInfo) => (
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
                    {tableComponents.columnsInfo.map((columnInfo, index) => (
                        <div key={index} className="table-cell">
                            {columnInfo.headerLabel}
                        </div>
                    ))}
                </div>
            </div>
            <div className="table-body">
                {data.map((rowData, index) => {
                    return <TableRow key={index} {...rowProps} rowData={rowData} />;    //--Fixing--------------------------------------
                })}
                {tableModes.hasAddingForm && (isAddingRow ? (
                    <Form
                        ref={addRowRef}
                        className="table-row add-row"
                        onSubmit={(formData) => {
                            tableStates.reduxPair.POST_thunk(formData);
                            setIsAddingRow(false);
                        }}
                    >
                        <div className="table-cell">
                            <Send className="send-icon" onClick={() => addRowRef.current.requestSubmit()} />
                        </div>
                        {tableModes.hasAddingForm &&
                            tableComponents.addingFormFields.map((fieldInfo, index) => (
                                <div className="table-cell" key={index}>
                                    {fieldInfo.inputCompo}
                                </div>
                            )
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
    );
}