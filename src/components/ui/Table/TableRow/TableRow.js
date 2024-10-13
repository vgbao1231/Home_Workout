import { Send } from 'lucide-react';
import { cloneElement, memo, useCallback, useEffect, useRef } from 'react';
import Form from '~/components/ui/Form/Form';

function TableRow({ tableState, 
    columns, 
    rowData, 
    updatingRowId, 
    canSelectingRow=true,
    eventRegistered = ()=>{}, 
    ...props
}) {
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

    const getCellContent = useCallback((columnInfo) => {
        if (columnInfo.buildField)  //--For Updating
            return cloneElement(
                columnInfo.buildField(rowData),
                { disabled: updatingRowId !== rowId, defaultValue: rowData[columnInfo.name]}
            );
        else if (columnInfo.replacedContent)    //--For orthers componenet
            return cloneElement(
                columnInfo.replacedContent(rowData),
                { defaultValue: rowData[columnInfo.name]}
            );
        else    //--For regular content
            return <span>{rowData[columnInfo.name]}</span>;
    }, []);

    return (
        <>
            <Form
                ref={updatingRowId === rowId ? tableRowRef : null}
                className={`table-row${updatingRowId === rowId ? ' active' : ''}`}
                {...eventRegistered(rowData)}
                {...props}
            >
                {canSelectingRow &&
                    <div className="table-cell">
                        {updatingRowId === rowId ? (
                            <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                        ) : (
                            <input type="checkbox" checked={!!tableState.selectedRows[rowId]} readOnly />
                        )}
                    </div>
                }
                {columns.map((columnInfo, index) => <div className="table-cell" key={index}>
                    {getCellContent(columnInfo)}
                </div>)}
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