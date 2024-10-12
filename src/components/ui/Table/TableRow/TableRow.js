import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useMemo, useRef } from 'react';
import Form from '~/components/ui/Form/Form';

function TableRow({ tableState, columns, rowData, updatingRowId, handleClick, handleContextMenu, ...props }) {
    // console.log('row render: ' + rowData.exerciseId);
    const tableRowRef = useRef();
    const rowId = rowData[tableState.primaryKey];

    useEffect(() => {
        if (updatingRowId === rowId) {
            const handleKeyDown = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    tableRowRef.current.requestSubmit();
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            // Cleanup when component unmount or isAddingRow is false
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [updatingRowId]);
    console.log(updatingRowId === rowId, updatingRowId, rowId)
    return (
        <>
            <Form
                ref={updatingRowId === rowId ? tableRowRef : null}
                className={`table-row${updatingRowId === rowId ? ' active' : ''}`}
                onClick={(e) => handleClick ? handleClick(e, rowData) : () => {}}
                onContextMenu={(e) => handleContextMenu ? handleContextMenu(e, rowData) : () => {}}
                {...props}
            >
                <div className="table-cell">
                    {updatingRowId === rowId ? (
                        <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                    ) : (
                        <input type="checkbox" checked={!!tableState.selectedRows[rowId]} readOnly />
                    )}
                </div>
                {columns.map((column, index) => (
                    <div className="table-cell" key={index}>
                        {column.buildField
                            ? cloneElement(
                                column.buildField(rowData),
                                { disabled: updatingRowId !== rowId, defaultValue: rowData[column.name]}
                            ) : <span>{rowData[column.name]}</span>
                        }
                    </div>
                ))}
            </Form>
            {updatingRowId === rowId && (
                <div className="table-row-overlay" onClick={() => tableRowRef.current.requestSubmit()}></div>
            )}
        </>
    );
}

// export default memo(TableRow);
export default memo(TableRow, (prevProps, nextProps) => {
    const primaryKey = prevProps.tableState.primaryKey;
    return (
        JSON.stringify(prevProps.rowData) === JSON.stringify(nextProps.rowData)
        && prevProps.tableState.selectedRows[prevProps.rowData[primaryKey]] === 
            nextProps.tableState.selectedRows[nextProps.rowData[primaryKey]]
        && prevProps.updatingRowId === nextProps.updatingRowId
    );
});