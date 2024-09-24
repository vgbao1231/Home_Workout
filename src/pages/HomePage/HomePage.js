import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ExerciseTable } from '~/components';
import { selectIsLoading } from '~/selectors/isLoadingSelector';
import { logoutThunk } from '~/store/authSlice';
import { fetchExerciseData } from '~/store/exerciseSlice';
import { fetchLevelData } from '~/store/levelSlice';
import { fetchMuscleData } from '~/store/muscleSlice';
import { addToast } from '~/store/toastSlice';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(selectIsLoading);

    console.log('home');

    // Handle log out
    const handleLogout = async () => {
        try {
            const result = await dispatch(logoutThunk()).unwrap();
            navigate('/login');
            dispatch(addToast(result.message, 'success'));
        } catch (error) {
            dispatch(addToast(error, 'error'));
        }
    };

    useEffect(() => {
        dispatch(fetchMuscleData());
        dispatch(fetchLevelData());
        dispatch(fetchExerciseData());
    }, [dispatch]);

    if (isLoading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="homepage">
            <h1>Homepage </h1>
            <button onClick={handleLogout}>Log Out</button>
            <ExerciseTable />
        </div>
    );
};

export default HomePage;
