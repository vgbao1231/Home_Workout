import { useDispatch, useSelector } from 'react-redux';
import UserInfoTable from './UserInfoTable/UserInfoTable';
import { EnumAdminThunk } from '~/redux/thunks/enumThunk';
import { addToast } from '~/redux/slices/toastSlice';
import { useEffect } from 'react';
import './ManageUserInfoPage.scss'

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

    return (
        <div className="manage-user-info-page">
            <span className='title center'>Manage User Info</span>
            <UserInfoTable />
        </div>
    );
};
