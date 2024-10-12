import { useDispatch, useSelector } from 'react-redux';
import UserInfoTable from './UserInfoTable/UserInfoTable';
import { EnumAdminThunk } from '~/redux/thunks/enumThunk';
import { addToast } from '~/redux/slices/toastSlice';
import { useEffect } from 'react';

export default function ManageUserInfoPage() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.enum.loading);

    useEffect(() => {
        (async function fetchEnums() {
            try {
                await dispatch(EnumAdminThunk.getAllGendersEnumThunk()).unwrap();
            } catch (error) {
                dispatch(addToast(error, 'error'));
            }
        })();
    }, [dispatch]);
    
    if (isLoading) {
        return <div>Loading data...</div>;
    }
    console.log("CALLED");

    return (
        <div className="manage-user-info-page">
            <h1>Manage User Info</h1>
            <UserInfoTable />
        </div>
    );
};
