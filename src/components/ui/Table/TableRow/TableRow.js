import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useRef } from 'react';
import Form from '~/components/ui/Form/Form';

function TableRow({ columns, rowData, isSelected, isUpdating, ...props }) {
    // console.log('row render: ' + rowData.exerciseId);

    const tableRowRef = useRef();

    useEffect(() => {
        if (isUpdating) {
            const handleKeyDown = (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    tableRowRef.current.requestSubmit();
                }
            };
            window.addEventListener('keydown', handleKeyDown);

            // Cleanup when component unmount or isAddingRow is false
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isUpdating]);

    return (
        <>
            <Form
                ref={isUpdating ? tableRowRef : null}
                className={`table-row${isUpdating ? ' active' : ''}`}
                {...props}
            >
                <div className="table-cell">
                    {isUpdating ? (
                        <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                    ) : (
                        <input type="checkbox" checked={!!isSelected} readOnly />
                    )}
                </div>
                {columns.map((column, index) => (
                    <div className="table-cell" key={index}>
                        {cloneElement(column.field, {
                            disabled: !isUpdating,
                            defaultValue: rowData[column.name]
                        })}
                    </div>
                ))}
            </Form>
            {isUpdating && (
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
        prevProps.isUpdating === nextProps.isUpdating
    );
});
