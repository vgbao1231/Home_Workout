import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from '~/components/Form/Form';
import { toggleSelectRow, updateRow } from '~/store/excerciseSlice';

function TableRow({ rowData, columns, setEditableRow, isSelected = false, isEditable, handleContextMenu }) {
    console.log('Rendering row:', rowData.id);
    const dispatch = useDispatch();
    const tableRowRef = useRef();
    const [originalRowData, setOriginalRowData] = useState(null);

    // Handle update data row onChange
    const handleRowChange = (field) => {
        dispatch(updateRow({ id: rowData.id, ...field }));
    };

    // Handle click on row
    const handleRowClick = () => {
        !isEditable && dispatch(toggleSelectRow(rowData.id));
    };

    const handleRowSubmit = (rowData) => {
        const { id, ...originalData } = originalRowData;

        if (JSON.stringify(rowData) !== JSON.stringify(originalData)) {
            if (window.confirm('Save?')) {
                dispatch(updateRow(rowData));
                // Call API update row
            } else {
                dispatch(updateRow(originalRowData));
            }
        }
        setEditableRow();
    };

    useEffect(() => {
        // Save original row data to restore if not submit
        isEditable && !originalRowData && setOriginalRowData(rowData);
    }, [isEditable, originalRowData, rowData]);

    return (
        <>
            <Form
                ref={isEditable ? tableRowRef : null}
                readOnly={!isEditable}
                className={`table-row${isEditable ? ' active' : ''}`}
                onClick={handleRowClick}
                onChange={handleRowChange}
                onContextMenu={(e) => handleContextMenu(e, rowData)}
                onSubmit={handleRowSubmit}
            >
                <div className="table-cell">
                    {isEditable ? (
                        <Send onClick={() => tableRowRef.current.requestSubmit()} />
                    ) : (
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleRowClick}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                </div>
                {columns.map((column) => {
                    return cloneElement(column.type, {
                        key: column.name,
                        className: 'table-cell',
                        name: column.name,
                        value: rowData[column.name],
                        ...column.props,
                    });
                })}
            </Form>
            {isEditable && (
                <div className="table-row-overlay" onClick={() => tableRowRef.current.requestSubmit()}></div>
            )}
        </>
    );
}

// export default memo(TableRow);
export default memo(TableRow, (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.rowData) === JSON.stringify(nextProps.rowData) &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isEditable === nextProps.isEditable
    );
});
