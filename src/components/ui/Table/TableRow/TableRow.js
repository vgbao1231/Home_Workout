import { Send } from 'lucide-react';
import { cloneElement, memo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from '~/components/ui/Form/Form';
import { toggleSelectRow, updateRow } from '~/store/exerciseSlice';

function TableRow({ rowData, columns, constrainStates, isSelected = false, handleOpenContextMenu }) {
    console.log('Rendering row:', rowData.id);
    const dispatch = useDispatch();
    const tableRowRef = useRef();
    const [originalRowData, setOriginalRowData] = useState(rowData); // Save original row data to restore if not submit
    const isEditable = constrainStates.updatingRowId === rowData.id;

    // Select row when click
    const handleRowClick = () => {
        !isEditable && dispatch(toggleSelectRow(rowData.id));
    };

    const handleUpdateRow = (formData) => {
        const { id, ...originalData } = originalRowData;

        if (JSON.stringify(formData) !== JSON.stringify(originalData)) {
            if (window.confirm('Save?')) {
                // Update new original row data
                setOriginalRowData(formData);
                dispatch(updateRow({ id: rowData.id, ...formData }));

                // Call API update row
            } else {
                dispatch(updateRow(originalRowData));
            }
        }
        constrainStates.setUpdatingRowId();
    };

    return (
        <>
            <Form
                ref={isEditable ? tableRowRef : null}
                className={`table-row${isEditable ? ' active' : ''}`}
                disabled={!isEditable}
                onClick={handleRowClick}
                onContextMenu={(e) => handleOpenContextMenu(e, rowData.id)}
                onSubmit={handleUpdateRow}
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
        prevProps.constrainStates.updatingRowId === nextProps.constrainStates.updatingRowId
    );
});
