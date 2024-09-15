import { Send } from 'lucide-react';
import { cloneElement, memo } from 'react';

const TableRow = memo(({ row, rowActive, onClick, onChange, onContextMenu }) => {
    console.log('Rendering row:', row.id);

    return (
        <Form
            ref={rowActive === row.id ? formRef : null}
            readOnly={rowActive !== row.id}
            className={`table-row${rowActive === row.id ? ' active' : ''}`}
            onClick={() => onClick(row)}
            onChange={(field) => onChange(field, row.id)}
            onContextMenu={(e) => onContextMenu(e, row)}
            onSubmit={handleSubmit}
        >
            <div className="table-cell">
                {rowActive === row.id ? (
                    <Send onClick={handleClickSubmit} />
                ) : (
                    <input
                        type="checkbox"
                        checked={!!selectedRows[row.id]}
                        onChange={() => onClick(row)}
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
    );
});

export default TableRow;
