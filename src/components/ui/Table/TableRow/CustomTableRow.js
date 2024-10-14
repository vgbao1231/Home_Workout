import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useMemo, useRef } from 'react';
import Form from '~/components/ui/Form/Form';

function TableRowBuilder({
    rowData, primaryKeyName, columnsInfo, selectedRows,
    handleSelectRow, updatingRowIdState, handleContextMenu,
    ...props
}) {
    console.log(rowData);
    const tableRowRef = useRef();
    const rowId = useMemo(() => rowData[primaryKeyName], []);
    const canUpdatingRow = useMemo(() => updatingRowIdState === rowId, [updatingRowIdState]), isUpdatingRow = canUpdatingRow;

    useEffect(() => {
        if (canUpdatingRow) {
            const handleKeyDown = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    tableRowRef.current.requestSubmit();
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            // Cleanup when component unmount or isAddingRow is false
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [updatingRowIdState]);

    return (
        <>
            <Form
                ref={canUpdatingRow ? tableRowRef : null}
                className={`table-row${isUpdatingRow ? ' active' : ''}`}
                onClick={e => handleSelectRow !== null ? handleSelectRow(e, rowData) : ()=>{}}
                onContextMenu={e => handleContextMenu !== null ? handleContextMenu(e, rowData) : ()=>{}}
                {...props}
            >
                {handleSelectRow === null || selectedRows === null
                    ? (isUpdatingRow ?
                        <div className="table-cell">
                            <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                        </div> : <></>
                    ) : (
                        <div className="table-cell">
                            {isUpdatingRow
                                ? <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                                : <input type="checkbox" checked={!!selectedRows[rowId]} readOnly />
                            }
                        </div>
                    )
                }
                {columnsInfo.map((columnInfo, index) => <div className="table-cell" key={index}>
                    {(function getCellContent() {
                        if (canUpdatingRow && columnInfo.updatingFieldBuilder)  //--For Updating
                            return cloneElement(
                                columnInfo.updatingFieldBuilder(rowData),
                                { disabled: !isUpdatingRow, defaultValue: rowData[columnInfo.name]}
                            );
                        else if (columnInfo.replacedContent)    //--For orthers componenet
                            return cloneElement(
                                columnInfo.replacedContent(rowData),
                                { defaultValue: rowData[columnInfo.name]}
                            );
                        else    //--For regular content
                            return <span>{rowData[columnInfo.name]}</span>;
                    })()}
                </div>)}
            </Form>
            {isUpdatingRow && (
                <div className="table-row-overlay" onClick={() => tableRowRef.current.requestSubmit()}></div>
            )}
        </>
    );
}

// export default memo(TableRow);
export default memo(TableRowBuilder, (prevProps, nextProps) => {
    return (
        JSON.stringify(prevProps.rowData) === JSON.stringify(nextProps.rowData)
        && (
            prevProps.selectedRows !== null &&
            prevProps.selectedRows[prevProps.rowData[prevProps.primaryKeyName]] === 
            nextProps.selectedRows[nextProps.rowData[prevProps.primaryKeyName]]
        )
        && prevProps.updatingRowIdState === nextProps.updatingRowIdState
    );
});