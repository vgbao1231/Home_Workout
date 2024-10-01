import './Table.scss';
import { selectAllRows } from '~/store/exerciseSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import TableRow from './TableRow/TableRow';
import Pagination from './Pagination/Pagination';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, Plus, Send, X } from 'lucide-react';
import Form from '../Form/Form';
import Select from '../Select/Select';

function Table({ className, columns, title, state, contextMenu, setContextMenu, tableRowProps, addRowProps }) {
    console.log('table');

    const dispatch = useDispatch();
    const { data, selectedRows, primaryKey, totalPages } = state;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isAddingRow, setIsAddingRow] = useState(false);
    const addRowRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);

    // Handle select all rows
    const handleSelectAll = useCallback(
        (e) => {
            dispatch(selectAllRows(e.target.checked));
        },
        [dispatch],
    );

    //Handle open filter box when click
    const handleFilter = useCallback((formData) => {
        const filterData = Object.fromEntries(Object.entries(formData).filter(([_, value]) => value));
        console.log(filterData);
    }, []);

    //Handle open sort box when click
    const handleSort = useCallback((formData) => {
        console.log(formData);
    }, []);

    useEffect(() => {
        if (addRowProps && isAddingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    setIsAddingRow(false); // Thoát chế độ chỉnh sửa
                    console.log('esc');
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            // Cleanup khi component unmount hoặc khi isAddingRow trở về false
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [addRowProps, isAddingRow]); // Lắng nghe thay đổi của addRowProps

    return (
        <div className={`table-wrapper ${className}`}>
            <div className="table-feature">
                <div className="table-title">{title}</div>
                <div className="table-tool center">
                    <div className="tool-button">
                        <ListFilter className="tool-icon" onClick={() => setIsFilterOpen(!isFilterOpen)} />
                        <Form className={`filter-box${isFilterOpen ? ' open' : ''}`} onSubmit={handleFilter}>
                            <div className="filter-header">
                                <span>Filter</span>
                                <X onClick={() => setIsFilterOpen(!isFilterOpen)} />
                            </div>
                            <div className="filter-body">
                                {columns.map((column, index) => (
                                    <div key={index} className="filter-criteria">
                                        <span>{column.header}</span>
                                        {column.field}
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
                        <Form className={`sort-box${isSortOpen ? ' open' : ''}`} onSubmit={handleSort}>
                            <div className="sort-header">
                                <span>Sort</span>
                                <X onClick={() => setIsSortOpen(!isSortOpen)} />
                            </div>
                            <div className="sort-body">
                                <div className="sort-criteria">
                                    <Select
                                        name="sortField"
                                        placeholder="Field"
                                        options={columns.map((option) => ({ value: option.name, text: option.header }))}
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
                    <div className="table-cell">
                        <input
                            type="checkbox"
                            checked={data.every((rowData) => selectedRows[rowData[primaryKey]])}
                            onChange={handleSelectAll}
                        />
                    </div>
                    {columns.map((column, index) => (
                        <div key={index} className="table-cell">
                            {column.header}
                        </div>
                    ))}
                </div>
            </div>

            <div className="table-body">
                {data.map((rowData, index) => {
                    return <TableRow key={index} {...tableRowProps(rowData)} />;
                })}
                {addRowProps && isAddingRow ? (
                    <Form
                        ref={addRowRef}
                        className="table-row add-row"
                        onSubmit={(formData) => {
                            addRowProps.onSubmit(formData);
                            setIsAddingRow(false);
                        }}
                    >
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
                    <div className="table-row add-row" onClick={() => setIsAddingRow(true)}>
                        <div className="table-cell">
                            <Plus />
                        </div>
                        <div className="table-cell">Add row</div>
                    </div>
                )}
            </div>
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <div className="table-pagination">
                <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={totalPages} />
            </div>
        </div>
    );
}

export default Table;
