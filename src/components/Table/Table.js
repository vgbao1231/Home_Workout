import './Table.scss';
import { selectAllRows } from '~/store/excerciseSlice';
import { useCallback, useState } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import TableRow from './TableRow/TableRow';
import Pagination from './Pagination/Pagination';
import { useDispatch } from 'react-redux';

function Table({ columns, title, data, selectedRows, editableRow, setEditableRow, contextMenuItems }) {
    console.log('table-render');

    const dispatch = useDispatch();
    const [contextMenu, setContextMenu] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Handle select all rows
    const handleSelectAll = useCallback(
        (e) => {
            dispatch(selectAllRows(e.target.checked));
        },
        [dispatch],
    );

    //Handle open menu when right click
    const handleContextMenu = useCallback((e, row) => {
        e.preventDefault();
        setContextMenu({
            target: row,
            isShown: true,
            x: e.pageX,
            y: e.pageY,
        });
    }, []);

    return (
        <div className="table-wrapper">
            <div className="table-feature">
                <div className="title">{title}</div>
                <div className="tool"></div>
            </div>
            <div className="table-header">
                <div className="table-cell">
                    <input
                        type="checkbox"
                        checked={data.every((row) => selectedRows[row.id])}
                        onChange={handleSelectAll}
                    />
                </div>
                {columns.map((column) => (
                    <div key={column.name} className="table-cell">
                        {column.text}
                    </div>
                ))}
            </div>

            <div className="table-body" onClick={() => contextMenu.isShown && setContextMenu({})}>
                {data.map((rowData) => (
                    <TableRow
                        key={rowData.id}
                        rowData={rowData}
                        isEditable={editableRow === rowData.id}
                        columns={columns}
                        setEditableRow={setEditableRow}
                        isSelected={selectedRows[rowData.id]}
                        handleContextMenu={handleContextMenu}
                    />
                ))}
            </div>
            <ContextMenu
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                contextMenuItems={contextMenuItems(contextMenu.target)}
            />
            <div className="table-pagination">
                <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={10} />
            </div>
        </div>
    );
}

export default Table;
