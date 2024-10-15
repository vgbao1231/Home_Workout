import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useRef } from 'react';
import Form from '~/components/ui/Form/Form';

function TableRow({ columns, rowData, tableMode, isSelected, isUpdating, ...props }) {
    const tableRowRef = useRef();
    const { enableSelect, enableEdit } = tableMode
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
                ref={tableRowRef}
                className={`table-row ${!enableEdit ? (isUpdating ? ' active' : '') : ''}`}
                {...props}
            >
                {enableSelect &&
                    <div className="table-cell">
                        {enableEdit &&
                            (isUpdating
                                ? <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                                : <input type="checkbox" checked={!!isSelected} readOnly={!enableEdit} />)}
                    </div>
                }
                {columns.map((column, index) => (
                    <div className="table-cell" key={index}>
                        {cloneElement(column.cell(rowData), {
                            // disabled: !isUpdating,
                            defaultValue: rowData[column.name]
                        })}
                    </div>
                ))}
            </Form>
            {isUpdating && <div className="table-row-overlay" onClick={() => tableRowRef.current.requestSubmit()}></div>}
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