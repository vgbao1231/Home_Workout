import { useDispatch, useSelector } from 'react-redux';
import './Slides.scss';
import { useCallback, useEffect, useState } from 'react';
import { SlidesUserThunk } from '~/redux/thunks/slidesThunk';
import { ChevronRight } from 'lucide-react';

export default function Slides() {
    const dispatch = useDispatch();
    const slideState = useSelector((state) => state.slides);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePullingNextSlide = useCallback(() => {
        setCurrentIndex(prev => slideState.data.length == prev + 1 ? 0 : prev + 1);
    }, [slideState.data]);

    useEffect(() => {
        dispatch(SlidesUserThunk.getAllSlides());
    }, []);

    useEffect(() => {
        const intervalId = setInterval(handlePullingNextSlide, 3000);
        return () => clearInterval(intervalId); //--Clear when unmounts or dep's state is 
    }, [currentIndex]);

    return (
        <div className="slides-user-home">
            {slideState.loading
                ? <div>Loading...</div>
                : <>
                    <div className="abstract-background" style={{
                        backgroundImage: `url("${slideState.data[currentIndex]?.imageUrl}")`
                    }}>
                        <div className="abstract-purdar"></div>
                    </div>
                    <div className="main-image">
                        <img src={slideState.data[currentIndex]?.imageUrl} alt="" />
                    </div>
                    <button className="next-slide-btn" onClick={handlePullingNextSlide}><ChevronRight /></button>
                </>
            }
        </div>
    );
}