import { Send } from 'lucide-react';
import { cloneElement, memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Form from '~/components/ui/Form/Form';

function TableRow({ columns, rowData, tableStates, tableReducers, tableModes, isSelected, isUpdating, ...props }) {
    // console.log('render: ', rowData);

    const dispatch = useDispatch()
    const tableRowRef = useRef();
    const { enableSelect, enableEdit } = tableModes

    const handleChange = (e) => {
        tableReducers && dispatch(tableReducers.toggleSelectRow(rowData[tableStates.primaryKey]))
    };

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
                defaultValues={rowData}
                {...props}
            >
                {enableSelect &&
                    <div className="table-cell">
                        {enableEdit ?
                            (<input type="checkbox" checked={!!isSelected} onChange={handleChange} onClick={(e) => e.stopPropagation()} />)
                            :
                            (
                                isUpdating
                                    ? <Send className="send-icon" onClick={() => tableRowRef.current.requestSubmit()} />
                                    : <input type="checkbox" checked={!!isSelected} onChange={handleChange} onClick={(e) => e.stopPropagation()} />
                            )
                        }
                    </div>
                }
                {columns.map((column, index) => (
                    !column.hidden &&
                    <div className="table-cell" key={index}>
                        {cloneElement(column.cell(rowData), {
                            disabled: column.editable === false || !(isUpdating || enableEdit),
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