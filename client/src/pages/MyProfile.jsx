import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import DashboardLayout from '../components/common/DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, getUser, logout } from '../app/features/authSlice';
import { toast } from 'keep-react';

const MyProfile = () => {
    const dispatch = useDispatch();
    const { user: currentUser, isPasswordChangeSuccess, loading, error } = useSelector((state) => state.auth);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };


    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);


    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        const data = {
            currentPassword,
            newPassword,
        }
        await dispatch(changePassword(data))
        resetForm()
    };

    useEffect(() => {
        if (isPasswordChangeSuccess) {
            dispatch(logout())
        }
    }, [dispatch, isPasswordChangeSuccess])

    if (!currentUser) {
        return (
            <DashboardLayout>
                <div className="p-10 text-center text-gray-500">Loading profile...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div>
                <div className="bg-white shadow-xl rounded-lg">
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="username" id="username" value={currentUser.username} disabled
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" id="email" value={currentUser.email || ''} disabled
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 cursor-not-allowed" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Change Password</h3>
                            <p className="text-sm text-gray-500 mb-4">Update your password for enhanced security.</p>
                        </div>

                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" name="currentPassword" id="currentPassword" required
                                value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" name="newPassword" id="newPassword" required
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" name="confirmNewPassword" id="confirmNewPassword" required
                                value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="pt-4 border-t mt-6 flex justify-end">
                            <button type="submit"
                                onClick={handleChangePassword}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm flex items-center gap-2">
                                <FiLock size={16} /> Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyProfile;
