import { useCallback, useState } from "react";
import { Form, Input } from "~/components";
import bodyTemplate from '~/assets/body_template.jpg';
import { ImageUp, Upload } from "lucide-react";
import './CalculateBodyFatForm.scss'
import { UserUserService } from "~/services/userService";
import { useDispatch } from "react-redux";
import { addToast } from "~/redux/slices/toastSlice";

function CalculateBodyFatForm({ gender, bodyFat, setBodyFat }) {
    const dispatch = useDispatch()
    const [image, setImage] = useState(bodyTemplate);

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImage(imgUrl);
        }
    };

    const handleSubmit = useCallback(async (data) => {
        try {
            const response = await UserUserService.calBodyFatDetection(data.image, gender)
            setBodyFat(response.data.bodyFatRatio)
            dispatch(addToast(response.message, 'success'));
        } catch (error) {
            console.log(error);
            dispatch(addToast(error.message, 'error'));
        }
    }, [dispatch, setBodyFat, gender])

    return (
        <Form className="calculate-body-fat-form center" onSubmit={handleSubmit}>
            <div className="form-title">
                <ImageUp />
                <span>Body Image Upload</span>
            </div>
            <div className="image-container">
                {image && <img src={image} alt="no-image" className="current-image" />}
                <label htmlFor="image-upload" className="upload-label">
                    <Upload className="upload-icon" />
                </label>
            </div>
            <div className="form-description">
                <p>Upload a full body image to help calculate body fat percentage.</p>
                <p>For best results, use a front-facing, full-body photo.</p>
            </div>
            {bodyFat && <div className="body-fat">{bodyFat}</div>}
            <Input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <button className="btn">Calculate</button>
        </Form>
    );
}

export default CalculateBodyFatForm;