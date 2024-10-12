import UserInfoTable from './UserInfoTable/UserInfoTable';

export default function ManageUserInfoPage() {
    const isLoading = useSelector(state => state.enum.loading);

    if (isLoading) {
        return <div>Loading data...</div>;
    }

    return (
        <div className="manage-user-info-page">
            <h1>Manage User Info</h1>
            <UserInfoTable />
        </div>
    );
};
