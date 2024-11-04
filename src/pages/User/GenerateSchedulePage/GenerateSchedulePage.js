import CalculateBodyFatForm from "./CalculateBodyFatForm/CalculateBodyFatForm";
import WorkoutScheduleForm from "./WorkoutScheduleForm/WorkoutScheduleForm";
import './GenerateSchedulePage.scss'
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { EnumUserThunk } from "~/redux/thunks/enumThunk";
import { addToast } from "~/redux/slices/toastSlice";
import { Dialog } from "~/components";

function GenerateSchedulePage() {
    const dispatch = useDispatch()
    const [gender, setGender] = useState(1)
    const [bodyFat, setBodyFat] = useState()
    const [dialogProps, setDialogProps] = useState({ isOpen: false, title: '', body: null });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(EnumUserThunk.getAllGendersEnumThunk()).unwrap();
                await dispatch(EnumUserThunk.getAllAimsEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };
        fetchData()
    }, [dispatch])
    return (
        <div className="generate-schedule-page">
            <CalculateBodyFatForm gender={gender} bodyFat={bodyFat} setBodyFat={setBodyFat} />
            <WorkoutScheduleForm bodyFat={bodyFat} setGender={setGender} setDialogProps={setDialogProps} />
            <Dialog dialogProps={dialogProps} setDialogProps={setDialogProps} />
        </div>
    );
}

export default GenerateSchedulePage;