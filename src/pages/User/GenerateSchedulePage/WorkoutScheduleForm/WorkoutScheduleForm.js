import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Select } from "~/components";
import { capitalizeWords } from "~/utils/formatters";
import './WorkoutScheduleForm.scss';
import { Calendar, Dumbbell, Goal, Minus, Plus, User, Weight } from "lucide-react";
import { useForm } from "react-hook-form";
import { addToast } from "~/redux/slices/toastSlice";
import { ScheduleUserService } from "~/services/scheduleService";
import ScheduleInfoDialog from "../ScheduleInfoDialog/ScheduleInfoDialog";

const repOptions = [
    { value: "3", text: "Original Level (100% level)" },
    { value: "2", text: "Average (90% level)" },
    { value: "1", text: "Easy (80% level)" }
];

const weightDownAimRatioOptions = [
    { value: "-10", text: "Slowly" },
    { value: "-20", text: "Normally" },
    { value: "-30", text: "Fast" },
    { value: "-40", text: "Crash" },
];

const weightUpAimRatioOptions = [
    { value: "5", text: "Slowly" },
    { value: "10", text: "Normally" },
    { value: "15", text: "Fast" }
];

function WorkoutScheduleForm({ bodyFat, setGender, setDialogProps }) {
    const dispatch = useDispatch()
    const { genders, aims } = useSelector(state => state.enum.data)
    const genderOptions = genders.map(gender => ({ value: gender.id, text: capitalizeWords(gender.raw) }));
    const aimOptions = aims.map(aim => ({ value: aim.type, text: aim.name }));
    const methods = useForm({ defaultValues: { aim: '1', gender: '1', repRatio: '3' } })
    const { getValues, setValue, watch } = methods;
    const genderValue = watch('gender');
    const aimValue = watch('aim');
    const weightValue = watch('weight');
    const weightAimValue = watch('weightAimByDiet');

    useEffect(() => {
        setGender(genderValue);
    }, [genderValue, setGender]);

    useEffect(() => {
        setValue('weightAimByDiet', weightValue);
    }, [weightValue, setValue]);

    const handleGenderChange = useCallback((e) => {
        dispatch(addToast("Please recalculate your body fat percentage due to gender change", 'info'))
    }, [dispatch])

    const handleDecrease = useCallback((name) => {
        setValue(name, (Number(getValues(name)) || 0) - 1)
    }, [setValue, getValues])

    const handleIncrease = useCallback((name) => {
        setValue(name, (Number(getValues(name)) || 0) + 1)
    }, [setValue, getValues])

    const handleSubmit = useCallback(async (data) => {
        try {
            data.bodyFat = bodyFat
            const formData = {
                age: data.age,
                gender: data.gender,
                weight: data.weight,
                session: data.session,
                bodyFat
            }
            const response = await ScheduleUserService.decideScheduleId(formData)
            setDialogProps({
                isOpen: true,
                title: 'Schedule Information',
                body: <ScheduleInfoDialog data={data} scheduleId={response.data.scheduleId} />
            });
            dispatch(addToast(response.message, 'success'));
        } catch (error) {
            console.log(error);
            !bodyFat ?
                dispatch(addToast("Please calculate body fat before submit", 'error')) :
                dispatch(addToast(error.message, 'error'));
        }
    }, [bodyFat, dispatch, setDialogProps])

    return (
        <Form className="workout-schedule-form" onSubmit={handleSubmit} methods={methods}>
            <div className="form-body">
                <div className="form-field aim">
                    <div className="field-name">
                        <Goal />
                        <span>Aim</span>
                    </div>
                    <Select name="aim" options={aimOptions} />
                </div>

                <div className="form-field">
                    <div className="field-name">
                        <User />
                        <span>Gender</span>
                    </div>
                    <Select name="gender" options={genderOptions} onChange={handleGenderChange} />
                </div>
                <div className="form-field">
                    <div className="field-name">
                        <Calendar />
                        <span>Age</span>
                    </div>
                    <div className="input-wrapper center">
                        <button type='button' onClick={() => handleDecrease('age')}><Minus /></button>
                        <Input type="number" name="age" defaultValue="18" min='14' />
                        <button type='button' onClick={() => handleIncrease('age')}><Plus /></button>
                    </div>
                </div>

                <div className="form-field">
                    <div className="field-name">
                        <Weight />
                        <span>Current Weight (kg)</span>
                    </div>
                    <div className="input-wrapper center">
                        <button type='button' onClick={() => handleDecrease('weight')}><Minus /></button>
                        <Input type="number" name="weight" defaultValue="60" min='30' />
                        <button type='button' onClick={() => handleIncrease('weight')}><Plus /></button>
                    </div>

                </div>
                <div className="form-field">
                    <div className="field-name">
                        <Dumbbell />
                        <span>Session Quantity</span>
                    </div>
                    <div className="input-wrapper center">
                        <button type='button' onClick={() => handleDecrease('session')}><Minus /></button>
                        <Input type="number" name="session" defaultValue="5" min='2' />
                        <button type='button' onClick={() => handleIncrease('session')}><Plus /></button>
                    </div>
                </div>
                <div className="form-field">
                    <div className="field-name">
                        <Dumbbell />
                        <span>Level's Difficulty</span>
                    </div>
                    <Select name="repRatio" options={repOptions} />
                </div>
                {aimValue !== '0' &&
                    <div className="form-field">
                        <div className="field-name">
                            <Dumbbell />
                            <span>Aim Ratio</span>
                        </div>
                        <Select name="aimRatio" options={aimValue === '1' ? weightUpAimRatioOptions : weightDownAimRatioOptions} />
                    </div>}
                {aimValue === '-1' &&
                    <>
                        <div className="form-field">
                            <div className="field-name">
                                <Dumbbell />
                                <span>Weight Aim</span>
                            </div>
                            <div className="input-wrapper center">
                                <button type='button' onClick={() => handleDecrease('weightAimByDiet')}><Minus /></button>
                                <Input type="number" name="weightAimByDiet" max={weightValue} min='30' />
                                <button type='button' disabled={weightAimValue >= weightValue} onClick={() => handleIncrease('weightAimByDiet')}><Plus /></button>
                            </div>
                        </div>

                    </>}
            </div>
            <button className="btn" style={{ marginTop: 'auto' }}>Submit</button>
        </Form>
    );
}

export default WorkoutScheduleForm;