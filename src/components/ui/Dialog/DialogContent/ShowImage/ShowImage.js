import { Upload } from 'lucide-react';
import './ShowImage.scss';
import { useState } from 'react';
import Form from '~/components/ui/Form/Form';
import Input from '~/components/ui/Input/Input';
import { uploadExerciseImage } from '~/services/exerciseService';
import { useDispatch } from 'react-redux';
import { addToast } from '~/redux/slices/toastSlice';
function ShowImage({ id, imageUrl }) {
    const [image, setImage] = useState(imageUrl);
    console.log(image);

    const dispatch = useDispatch();

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImage(imgUrl);
        }
    };
    const handleSubmit = async (img) => {
        try {
            const response = await uploadExerciseImage(img, id);
            dispatch(addToast(response.message, 'success'));
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
                    {image && <img src={image} alt="123" className="current-image" />}
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
                <button>Upload</button>
            </Form>
        </>
    );
}

export default ShowImage;
