import './ImageDialog.scss'

export default function ImageDialog({ imageUrl }) {
    return <div className="slide-image-dialog">
        <img src={imageUrl} alt="slide-image" />
    </div>;
}