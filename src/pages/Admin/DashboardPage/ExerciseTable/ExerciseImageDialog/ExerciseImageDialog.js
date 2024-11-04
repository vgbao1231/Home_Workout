import { Upload } from 'lucide-react';
import './ExerciseImageDialog.scss';
import { useState } from 'react';
import Form from '~/components/ui/Form/Form';
import Input from '~/components/ui/Input/Input';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
import noImage from '~/assets/no_image.jpg';
import { ExerciseAdminService } from '~/services/exerciseService';

function ExerciseImageDialog({ id, imageUrl, onClose }) {
    const [image, setImage] = useState(imageUrl || noImage);

    const dispatch = useDispatch();

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImage(imgUrl);
        }
    };
    const handleSubmit = async (data) => {
        try {
            const response = await ExerciseAdminService.uploadExerciseImage(id, data.image);
            dispatch(addToast(response.message, 'success'));
            onClose()
        } catch (error) {
            dispatch(addToast(error.message, 'error'));
        }
    };
    return (
        <>
            <div className="dialog-description">
                View or update the current image. Click the image to upload a new one.
            </div>
            <Form onSubmit={handleSubmit}>
                <div className="image-container">
                    {image && <img src={image} alt="no-image" className="current-image" />}
                    <label htmlFor="image-upload" className="upload-label">
                        <Upload className="upload-icon" />
                    </label>
                </div>
                <Input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    hidden
                />
                <button className="btn">Upload</button>
            </Form>
        </>
    );
}

export default ExerciseImageDialog;
