import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Pencil, Trash2, Upload } from 'lucide-react';
import Input from '../ui/Input/Input';
import MultiSelect from '../ui/MultiSelect/MultiSelect';
import Select from '../ui/Select/Select';
import Table from '../ui/Table/Table';
import './ExerciseTable.scss';
import { toggleSelectRow, updateRow } from '~/store/exerciseSlice';
import { isRequired } from '~/utils/validators';

function ExerciseTable() {
    console.log('exercise table');

    const dispatch = useDispatch();
    const exerciseState = useSelector((state) => state.exercise);
    const levelData = useSelector((state) => state.level.levelData);
    const muscleData = useSelector((state) => state.muscle.muscleData);
    const [contextMenu, setContextMenu] = useState({});
    const [updatingRowId, setUpdatingRowId] = useState(null);

    // Exercise columns props (or cell props in table body)
    const muscleOptions = useMemo(() => muscleData.map((option) => ({ value: option, text: option })), [muscleData]);
    const levelOptions = useMemo(() => levelData.map((option) => ({ value: option, text: option })), [levelData]);

    const exerciseColumns = useMemo(
        () => [
            // { header: '', field: <Input type="checkbox" name="exerciseId" /> },
            { header: 'Name', field: <Input name="name" /> },
            { header: 'Muscle List', field: <MultiSelect name="muscleList" options={muscleOptions} /> },
            { header: 'Level', field: <Select name="level" options={levelOptions} /> },
            { header: 'Basic Reps', field: <Input name="basicReps" /> },
        ],
        [muscleOptions, levelOptions],
    );

    const tableRowProps = (rowData) => {
        const isUpdating = rowData.exerciseId === updatingRowId;

        //Handle click row
        const handleClick = () => {
            !isUpdating && dispatch(toggleSelectRow(rowData.exerciseId));
        };

        //Handle open menu when right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            setContextMenu({
                isShown: true,
                x: e.pageX,
                y: e.pageY,
                menuItems: [
                    { text: 'Update Exercise', icon: <Pencil />, action: () => setUpdatingRowId(rowData.exerciseId) },
                    {
                        text: 'Delete Exercise',
                        icon: <Trash2 />,
                        action: () => console.log('Delete: ' + rowData.exerciseId),
                    },
                    {
                        text: 'Show Exercise Img',
                        icon: <Image />,
                        action: () => console.log('Show Img: ' + rowData.exerciseId),
                    },
                ],
            });
        };

        // Handle update row data
        const handleSubmit = (formData) => {
            if (formData) {
                console.log('row submit (call api)');
                dispatch(updateRow(formData));
            }
            setUpdatingRowId();
        };

        return {
            rowData,
            columns: exerciseColumns,
            isSelected: exerciseState.selectedRows[rowData.exerciseId],
            isUpdating,
            onClick: handleClick,
            onContextMenu: handleContextMenu,
            onSubmit: handleSubmit,
            confirm: true, // Ask confirm before submit
        };
    };

    // Properties to create add row form
    const addRowProps = useMemo(() => {
        return {
            onSubmit: (addRowData) => {
                const { img, ...rowData } = addRowData;
                const formData = new FormData();
                if (img && img.length > 0) {
                    const file = img[0]; // Lấy file đầu tiên từ FileList
                    formData.append('img', file); // Append file
                    formData.append('fileName', file.name); // Append tên file
                    formData.append('fileSize', file.size); // Append kích thước file
                }
                console.log(rowData);
            },
            fields: [
                { field: <Input placeholder="Name" name="name" validators={{ isRequired }} /> },
                { field: <MultiSelect placeholder="Muscle List" name="muscleList" options={muscleOptions} /> },
                { field: <Select placeholder="Select Level" name="level" options={levelOptions} /> },
                { field: <Input placeholder="Basic Reps" name="basicReps" /> },
                {
                    field: (
                        <label htmlFor="exercise-img" style={{ display: 'flex' }}>
                            <Upload className="upload-icon" />
                            <Input id="exercise-img" name="img" type="file" />
                        </label>
                    ),
                },
            ],
        };
    }, [muscleOptions, levelOptions]);
    return (
        <>
            <Table
                className="exercise-table"
                title="Exercise"
                columns={exerciseColumns}
                state={exerciseState}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
                tableRowProps={tableRowProps}
                addRowProps={addRowProps}
            />
        </>
    );
}

export default ExerciseTable;
