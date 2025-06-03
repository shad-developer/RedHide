import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../components/common/DashboardLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { addFlock, deleteFlock, getFlocks, updateFlock } from "../app/features/flockSlice";

const Flock = () => {
    const dispatch = useDispatch();
    const { flocks, loading } = useSelector((state) => state.flock);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFlock, setEditingFlock] = useState(null);
    const [flockName, setFlockName] = useState("");
    const [startDate, setStartDate] = useState("");

    useEffect(() => {
        dispatch(getFlocks());
    }, [dispatch]);

    const resetForm = () => {
        setFlockName("");
        setStartDate("");
        setEditingFlock(null);
    };

    const handleSaveFlock = async (e) => {
        e.preventDefault();
        if (!flockName || !startDate) return;

        if (editingFlock) {
            await dispatch(updateFlock({ id: editingFlock._id, flockName, startDate }));
        } else {
            await dispatch(addFlock({ flockName, startDate }));
        }
        dispatch(getFlocks());
        resetForm();
        setIsModalOpen(false);
    };

    const handleEdit = (flock) => {
        setEditingFlock(flock);
        setFlockName(flock.flockName);
        setStartDate(new Date(flock.startDate).toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this flock?")) {
            await dispatch(deleteFlock(id));
            dispatch(getFlocks());
        }
    };

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Flocks</h1>
                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    Add Flock
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading && flocks.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading flocks data...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-center">Sr</th>
                                    <th className="border px-4 py-2 text-left">Flock Name</th>
                                    <th className="border px-4 py-2 text-left">Start Date</th>
                                    <th className="border px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flocks && flocks.length > 0 ? (
                                    flocks.map((flock, index) => (
                                        <tr key={flock._id}>
                                            <td className="border px-4 py-2 text-center">{index + 1}</td>
                                            <td className="border px-4 py-2">{flock.flockName}</td>
                                            <td className="border px-4 py-2">{new Date(flock.startDate).toLocaleDateString('en-GB')}</td>
                                            <td className="border px-4 py-2 space-x-2">
                                                <button
                                                    className="text-green-500 hover:text-green-700 mr-3"
                                                    onClick={() => handleEdit(flock)} >
                                                    <FaEdit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(flock._id)}
                                                    className="text-red-500 hover:text-red-700">
                                                    <FaTrashAlt  size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center py-4">
                                            No flocks found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full transform transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingFlock ? "Edit Flock" : "Add Flock"}
                            </h2>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsModalOpen(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 -mr-1"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                        </div>
                        <form onSubmit={handleSaveFlock}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Flock Name</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    value={flockName}
                                    onChange={(e) => setFlockName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-5">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                >
                                    {editingFlock ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Flock;
