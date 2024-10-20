import './Table.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import TableRow from './TableRow/TableRow';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, Plus, Send, X } from 'lucide-react';
import Form from '../Form/Form';
import Select from '../Select/Select';

function Table({ title, columns, tableStates, tableReducers, rowProps, addRowProps, tableModes }) {

    const dispatch = useDispatch();
    const { data, primaryKey, selectedRows, filterData, sortData } = tableStates;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const addRowRef = useRef();

    // Handle select all rows
    const handleSelectAll = useCallback(
        (e) => tableReducers && dispatch(tableReducers.selectAllRows(e.target.checked)),
        [dispatch, tableReducers],
    );

    useEffect(() => {
        if (addRowProps && addRowProps.isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    addRowProps.setIsAddingRow(false); // Turn off adding mode
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            // Cleanup when component unmount or isAddingRow is false
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [addRowProps]);

    return (
        <div className='table-wrapper'>
            <div className="table-feature">
                <div className="table-title">{title}</div>
                <div className="table-tool center">
                    {/* Filter Form */}
                    {tableModes.enableFilter && <div className="tool-button">
                        <ListFilter className="tool-icon" onClick={() => setIsFilterOpen(!isFilterOpen)} />
                        <Form
                            className={`filter-box${isFilterOpen ? ' open' : ''}`}
                            onSubmit={(formData) => tableReducers && dispatch(tableReducers.setFilterData(formData))}
                            defaultValues={filterData}
                        >
                            <div className="filter-header">
                                <span>Filter</span>
                                <X onClick={() => setIsFilterOpen(!isFilterOpen)} />
                            </div>
                            <div className="filter-body">
                                {columns.map((column, index) =>
                                    column.filterable !== false &&
                                    <div key={index} className="filter-criteria">
                                        <span>{column.header}</span>
                                        {column.customFilter ? column.customFilter() : column.cell()}
                                    </div>
                                )}
                            </div>
                            <button className="filter-footer">
                                <ListFilter />
                                <span>Confirm</span>
                            </button>
                        </Form>
                        {isFilterOpen && (
                            <div className="filter-overlay" onClick={() => setIsFilterOpen(!isFilterOpen)}></div>
                        )}
                    </div>}
                    {/* Sort Form */}
                    {tableModes.enableSort && <div className="tool-button">
                        <ArrowDownUp className="tool-icon" onClick={() => setIsSortOpen(!isSortOpen)} />
                        <Form
                            className={`sort-box${isSortOpen ? ' open' : ''}`}
                            onSubmit={(formData) => tableReducers && dispatch(tableReducers.setSortData(formData))}
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
                                        options={columns
                                            .filter(({ sortable = true }) => sortable)
                                            .map(({ customSort, name, header }) => ({ value: customSort || name, text: header }))}
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
                    </div>}
                </div>
            </div>
            <div className="table-header">
                <div className="table-row">
                    {tableModes.enableSelect && <div className="table-cell">
                        <input
                            type="checkbox"
                            checked={data.every((rowData) => selectedRows[rowData[primaryKey]])}
                            onChange={handleSelectAll}
                        />
                    </div>}
                    {columns.map((column, index) =>
                        !column.hidden &&
                        (
                            <div key={index} className="table-cell">
                                {column.header}
                            </div>
                        )
                    )}
                </div>
            </div>

            <div className="table-body">
                {data.map((rowData, index) =>
                    <TableRow key={index} {...rowProps(rowData)}
                        rowData={rowData}
                        columns={columns}
                        tableStates={tableStates}
                        tableReducers={tableReducers}
                        tableModes={tableModes}
                    />
                )}
                {addRowProps &&
                    (addRowProps.isAddingRow ? (
                        <Form ref={addRowRef} className="table-row add-row" onSubmit={(formData) => addRowProps.onSubmit(formData)} >
                            <div className="table-cell">
                                <Send className="send-icon" onClick={() => addRowRef.current.requestSubmit()} />
                            </div>
                            {addRowProps.fields.map((addField, index) => (
                                <div className="table-cell" key={index}>
                                    {addField.field}
                                </div>
                            ))}
                        </Form>
                    ) : (
                        <div className="table-row add-row"
                            onClick={() => addRowProps.customAddForm ? addRowProps.customAddForm() : addRowProps.setIsAddingRow(true)}>
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

export default Table;