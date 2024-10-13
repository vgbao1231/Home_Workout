import { createSlice } from '@reduxjs/toolkit';
import { UserInfoAdminThunk, UserInfoUserThunk } from '../thunks/userInfoThunk';

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        primaryKey: 'userInfoId',
        selectedRows: {},
        data: [],
        totalPages: 1,
        loading: true, // Default is true so that when there is no data, loading will appear
        message: '',
    },
    extraReducers: (builder) => {
        // Get all userInfo
        builder
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.fulfilled, (state, action) => {
                const data = {
                    data: [],
                    currentPage: 1,
                    totalPages: 1,
                    message: "Succeed"
                }
                for (let ind = 0; ind <= 40; ind++)
                    data.data.push({
                        userInfoId: ind,
                        firstName: "Dung",
                        lastName: "Le Van",
                        gender: "MALE",
                        email: "user@gmail.com",
                        coins: 2000,
                        dob: [
                            2003,
                            12,
                            11
                        ],
                        userId: 2,
                        createdTime: [
                            2024,
                            10,
                            11,
                            10,
                            0,
                            0,
                            895959000
                        ],
                        active: ind%2==0
                    });
                state.loading = false;
                // state.data = action.payload.data.data.map(objData => ({
                //     ...objData,
                //     dob: new Date(...objData.dob).toISOString().slice(0, 10),
                //     createdTime: new Date(...objData.createdTime).toISOString(),
                // }));
                // state.totalPages = action.payload.data.totalPages;
                // state.message = action.payload.message;
                state.data = data.data.map(objData => ({
                    ...objData,
                    dob: new Date(...objData.dob).toISOString().slice(0, 10),
                    createdTime: new Date(...objData.createdTime).toISOString(),
                }));;
                state.totalPages = data.totalPages;
                state.message = data.message;
            })
            .addCase(UserInfoAdminThunk.getAllUserInfoThunk.rejected, (state) => {
                state.loading = false;
            });

        // Update userStatus
        builder
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(UserInfoAdminThunk.updateUserStatusThunk.rejected, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            });
    },
});

export const { toggleSelectRow, selectAllRows } = userInfoSlice.actions;
export default userInfoSlice.reducer;
