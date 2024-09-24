import './Table.scss';
import { selectAllRows } from '~/store/exerciseSlice';
import { cloneElement, useCallback, useState } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import TableRow from './TableRow/TableRow';
import Pagination from './Pagination/Pagination';
import { useDispatch } from 'react-redux';
import { ArrowDownUp, ListFilter, X } from 'lucide-react';
import Form from '../Form/Form';

export const TABLE_CONFIG = {
    ROW_ACTIONS: {
        UPDATE: 0,
        DELETE: 1,
    },
    buildMenuItem: (itemName = '', iconCompo = null, actionMode, actionApi, action = () => {}) => {
        return {
            text: itemName,
            icon: iconCompo,
            actionApi: actionApi,
            actionMode: actionMode,
            action: action,
        };
    },
};

function Table({ columns, title, data, selectedRows, contextMenuItems }) {
    console.log('table');

    const dispatch = useDispatch();
    const [contextMenu, setContextMenu] = useState({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [updatingRowId, setUpdatingRowId] = useState(null);
    const constrainStates = {
        updatingRowId,
        setUpdatingRowId,
    };

    // Handle select all rows
    const handleSelectAll = useCallback(
        (e) => {
            dispatch(selectAllRows(e.target.checked));
        },
        [dispatch],
    );

    // Handle config context menu item action
    contextMenuItems.forEach((itemConfig) => {
        if (itemConfig.actionMode === TABLE_CONFIG.ROW_ACTIONS.UPDATE) {
            itemConfig.action = () => {
                setUpdatingRowId(contextMenu.target);
            };
        }
        if (itemConfig.actionMode === TABLE_CONFIG.ROW_ACTIONS.DELETE) {
            itemConfig.action = () => {
                console.log('delete row');
            };
        }
    });

    //Handle open menu when right click
    const handleOpenContextMenu = useCallback((e, rowId) => {
        e.preventDefault();
        setContextMenu({
            target: rowId,
            isShown: true,
            x: e.pageX,
            y: e.pageY,
        });
    }, []);

    //Handle open filter box when click
    const handleFilter = useCallback((formFilter) => {
        console.log(formFilter);
    }, []);

    return (
        <div className="table-wrapper">
            <div className="table-feature">
                <div className="table-title">{title}</div>
                <div className="table-tool center">
                    <div className="tool-button">
                        <ListFilter onClick={() => setIsFilterOpen(!isFilterOpen)} />
                        <div className={`filter-box${isFilterOpen ? ' open' : ''}`}>
                            <div className="filter-header">
                                <span>Filter</span>
                                <X />
                            </div>
                            <div className="filter-container">
                                {/* <Form onSubmit={handleFilter}>
                                    {columns.map((column, index) => (
                                        <Fragment key={index}>
                                            <span>{column.text}</span>
                                            {cloneElement(column.type, {
                                                name: column.name,
                                                ...column.props,
                                            })}
                                        </Fragment>
                                    ))}
                                    <button>Filter</button>
                                </Form> */}
                            </div>
                        </div>
                    </div>
                    <div className="tool-button">
                        <ArrowDownUp onClick={() => setIsSortOpen(!isSortOpen)} />
                        <div className="sort-box"></div>
                    </div>
                </div>
            </div>
            <div className="table-header">
                <div className="table-cell">
                    <input
                        type="checkbox"
                        checked={data.every((row) => selectedRows[row.id])}
                        onChange={handleSelectAll}
                    />
                </div>
                {columns.map((column, index) => (
                    <div key={index} className="table-cell">
                        {column.text}
                    </div>
                ))}
            </div>

            <div className="table-body" onClick={() => contextMenu.isShown && setContextMenu({})}>
                {data.map((rowData) => (
                    <TableRow
                        key={rowData.id}
                        rowData={rowData}
                        columns={columns}
                        isSelected={selectedRows[rowData.id]}
                        handleOpenContextMenu={handleOpenContextMenu}
                        constrainStates={constrainStates}
                    />
                ))}
            </div>
            <ContextMenu
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                contextMenuItems={contextMenuItems} //rowData
            />
            <div className="table-pagination">
                <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalPages={10} />
            </div>
        </div>
    );
}

export default Table;
