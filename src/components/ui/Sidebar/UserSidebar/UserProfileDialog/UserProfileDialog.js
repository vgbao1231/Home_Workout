import { cloneElement, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "~/components/ui/Form/Form";
import Input from "~/components/ui/Input/Input";
import Select from "~/components/ui/Select/Select";
import Tabs from "~/components/ui/Tabs/Tabs";
import { addToast } from "~/redux/slices/toastSlice";
import { EnumUserThunk } from "~/redux/thunks/enumThunk";
import { capitalizeWords, equalsIgnoreCaseCustom, formatResponseLocalDate, trimWords } from "~/utils/formatters";
import { isRequired } from "~/utils/validators";
import './UserProfileDialog.scss';
import { useMultistepForm } from "~/hooks/useMultiStepForm";
import { UserInfoUserService } from "~/services/userInfoService";
import ChangePasswordForm from "./ChangePasswordForm/ChangePasswordForm";
import OtpForm from "./OtpForm/OtpForm";

function UserProfileDialog({ userProfile, onClose }) {
    console.log(userProfile);

    const dispatch = useDispatch()

    const tabs = [
        { label: "Profile", content: <ProfileTab userProfile={userProfile} /> },
        { label: "Password", content: <PasswordTab userProfile={userProfile} onClose={onClose} /> }
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(EnumUserThunk.getAllGendersEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        };
        fetchData()
    }, [dispatch])

    return (
        <Tabs tabs={tabs} />
    );
}

function ProfileTab({ userProfile }) {
    const dispatch = useDispatch()
    const genders = useSelector(state => state.enum.data.genders)
    const genderOptions = genders.map(gender => ({ value: gender.id, text: capitalizeWords(gender.raw) }));

    const handleSubmit = async (data) => {
        try {
            const { userInfoId, coins, email, gender, ...formData } = data
            formData.genderId = gender
            const response = await UserInfoUserService.updateUserInfo(formData)
            dispatch(addToast(response.message, 'success'));
        } catch (error) {
            console.log(error);
            dispatch(addToast(error.message, 'error'));
        }
    }

    return (
        <Form className="profile-form" onSubmit={handleSubmit}
            defaultValues={
                {
                    ...userProfile,
                    dob: formatResponseLocalDate(userProfile.dob),
                    gender: genderOptions.find(opt => equalsIgnoreCaseCustom(opt.text) === equalsIgnoreCaseCustom(userProfile.gender))?.value
                }}>
            <div className="name-wrapper">
                <Input
                    name="lastName"
                    label="LastName"
                    validators={{ isRequired }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
                <Input
                    name="firstName"
                    label="FirstName"
                    validators={{ isRequired }}
                    formatters={{
                        onChange: [trimWords],
                    }}
                />
            </div>
            <Input name="dob" type="date" label="Date of Birth" />
            <Select name="gender" label="Gender" options={genderOptions} />
            <button className="btn">Save Changes</button>
        </Form>
    );
}

function PasswordTab({ userProfile, onClose }) {
    const { currentStepIndex, step, isLastStep, next } = useMultistepForm([
        <ChangePasswordForm />,
        <OtpForm />,
    ]);
    const [formData, setFormData] = useState()
    const [otpExpiredTime, setOtpExpiredTime] = useState()

    const handleSubmit = useCallback(async (data) => {
        setFormData(data)
        // Before going to the otp form, send the api to get the otp code
        if (currentStepIndex === 0) {
            const response = await UserInfoUserService.getOtpToChangePassword({ email: userProfile.email, password: data.currentPassword })
            setOtpExpiredTime(response.data.ageInSeconds);
            return next();
        }
        if (!isLastStep) return next();
        onClose()
    }, [currentStepIndex, isLastStep, next, userProfile.email])

    return (
        <Form className="profile-form" onSubmit={handleSubmit}>
            {currentStepIndex === 1 ? cloneElement(step, { formData, otpExpiredTime }) : step}
        </Form>
    );
}

export default UserProfileDialog;