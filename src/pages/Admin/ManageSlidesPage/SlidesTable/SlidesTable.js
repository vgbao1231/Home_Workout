import { useDispatch, useSelector } from 'react-redux';
import './SlidesTable.scss'
import { useCallback, useMemo, useState } from 'react';
import { SlidesAdminThunk } from '~/redux/thunks/slidesThunk';
import { addToast } from '~/redux/slices/toastSlice';
import { FormatterDict, Table } from '~/components/ui/Table/CustomTable';
import ContextMenu from '~/components/ui/Table/ContextMenu/ContextMenu';
import { Dialog, Input } from '~/components';
import { Image, Upload } from 'lucide-react';
import ImageDialog from '../ImageDialog/ImageDialog';

export default function SlidesTable() {
    const dispatch = useDispatch()
    const slidesState = useSelector((state) => state.slides);
    const [contextMenu, setContextMenu] = useState({});
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    const deleteButtonReplacedContent = useCallback((rowData) => <button name="id" plain={`${rowData.id}`}
        onClick={async e => {
            e.stopPropagation();
            await dispatch(SlidesAdminThunk.deleteSlide({ id: rowData.id })).unwrap();
        }}>
        Delete
    </button>, []);

    const tableComponents = useMemo(() => FormatterDict.TableComponents({
        reduxInfo: {
            GET_thunk: {
                thunk: SlidesAdminThunk.getAllSlides
            }
        },
        tableInfo: {
            columnsInfo: [
                FormatterDict.ColumnInfo('id', 'Id'),
                FormatterDict.ColumnInfo('name', 'Image Slide Name'),
                FormatterDict.ColumnInfo('deletedId', 'Delete Button', null, deleteButtonReplacedContent)
            ],
        },
        reducers: {
            globalToastEngine: addToast
        }
    }), []);

    const addingFormComponents = useMemo(() => FormatterDict.AddingFormComponents({
        handleSubmit: async formData => {
            const abstractFormData = new FormData();
            abstractFormData.append('name', formData.name);
            abstractFormData.append('image', formData.image[0]);
            await dispatch(SlidesAdminThunk.uploadSlide(abstractFormData)).unwrap();
        },
        inputCompos: [
            FormatterDict.AddingField(<Input name="name" placeholder='Slide Name' required />),
            FormatterDict.AddingField(<label htmlFor="slide-img" style={{ display: 'flex' }}>
                <Upload className="upload-icon" />
                <Input id="slide-img" name="image" type="file" required />
            </label>),
        ]
    }), []);

    const contextMenuComponents = useMemo(() => FormatterDict.ContextMenuComponents([
        rowData => ({
            text: 'Show Image',
            icon: <Image />,
            action: () =>
                setDialogProps({
                    isOpen: true,
                    title: '',
                    body: <ImageDialog imageUrl={rowData.imageUrl} />,
                }),
        }),
    ]), []);

    return (
        <div className="slides-table">
            <Table
                title="Slide Images"
                tableState={slidesState}
                pageState={0}
                tableComponents={tableComponents}
                addingFormComponents={addingFormComponents}
                contextMenuComponents={contextMenuComponents}
                tableModes={FormatterDict.TableModes(false, false, false, true, true)}
            />
            <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}