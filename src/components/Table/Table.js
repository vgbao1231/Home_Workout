import { useDispatch, useSelector } from 'react-redux';
import './Table.scss';
import { selectAllRows, toggleSelectRow, updateRow } from '~/store/excerciseSlice';
import { cloneElement, Fragment, useRef, useState } from 'react';
import Form from '../Form/Form';
import { Pencil, Send, Trash2 } from 'lucide-react';
import ContextMenu from './ContextMenu/ContextMenu';

function Table({ columns }) {
    // console.log('table-render');

    const dispatch = useDispatch();
    const data = useSelector((state) => state.excercise.data);
    const selectedRows = useSelector((state) => state.excercise.selectedRows);
    const [rowActive, setRowActive] = useState(); // Row that you are working on (1 row only)
    const [contextMenu, setContextMenu] = useState({});
    const [originalRowData, setOriginalRowData] = useState(); // Restore row data when not submit
    const formRef = useRef(null);

    // Handle toggle select row
    const handleSelect = (id) => {
        dispatch(toggleSelectRow(id));
    };
    // Handle select all rows
    const handleSelectAll = (e) => {
        dispatch(selectAllRows(e.target.checked));
    };
    // Handle update data select row (No need)
    const handleRowChange = (field, rowId) => {
        dispatch(updateRow({ id: rowId, ...field }));
    };

    const handleSubmit = (rowData) => {
        const { id, ...originalData } = originalRowData;

        if (JSON.stringify(rowData) !== JSON.stringify(originalData)) {
            if (window.confirm('Save?')) {
                dispatch(updateRow(rowData));
                // Call API update row
            } else {
                dispatch(updateRow(originalRowData));
            }
        }
        setRowActive();
    };

    const handleClickSubmit = () => {
        formRef.current.requestSubmit();
    };

    const handleRowActive = (row) => {
        setRowActive(row.id);
        setOriginalRowData(row);
    };

    const handleContextMenu = (e, row) => {
        e.preventDefault();
        setContextMenu({
            target: row,
            isShown: true,
            x: e.pageX,
            y: e.pageY,
        });
    };

    return (
        <div className="table-wrapper">
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

            <div className="table-body">
                {data.map((row) => (
                    <Fragment key={row.id}>
                        <Form
                            ref={rowActive === row.id ? formRef : null}
                            readOnly={rowActive !== row.id}
                            className={`table-row${rowActive === row.id ? ' active' : ''}`}
                            onClick={() => {
                                rowActive !== row.id && handleSelect(row.id);
                                setContextMenu({});
                            }}
                            onChange={(field) => handleRowChange(field, row.id)}
                            onContextMenu={(e) => handleContextMenu(e, row)}
                            onSubmit={handleSubmit}
                        >
                            <div className="table-cell">
                                {rowActive === row.id ? (
                                    <Send onClick={handleClickSubmit} />
                                ) : (
                                    <input
                                        type="checkbox"
                                        checked={!!selectedRows[row.id]}
                                        onChange={() => handleSelect(row.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                )}
                            </div>
                            {columns.map((column) => {
                                return cloneElement(column.type, {
                                    key: column.name,
                                    className: 'table-cell',
                                    name: column.name,
                                    value: row[column.name],
                                    ...column.props,
                                });
                            })}
                        </Form>
                        {rowActive === row.id && (
                            <div className="table-row-background" onClick={handleClickSubmit}></div>
                        )}
                    </Fragment>
                ))}
                <button
                    onClick={() => {
                        console.log(selectedRows);
                    }}
                >
                    Submit
                </button>
            </div>
            <ContextMenu
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                menuItems={[
                    {
                        text: 'Update Exercise',
                        icon: <Pencil />,
                        onClick: () => handleRowActive(contextMenu.target),
                    },
                    {
                        text: 'Delete Exercise',
                        icon: <Trash2 />,
                        onClick: () => console.log('Delete'),
                    },
                ]}
            />
        </div>
    );
}

export default Table;
