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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Flocks</h1>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                >
                    Add Flock
                </button>
            </div>
            <div className="bg-white rounded shadow p-4">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2 text-left">Flock Name</th>
                                <th className="border px-4 py-2 text-left">Start Date</th>
                                <th className="border px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flocks && flocks.length > 0 ? (
                                flocks.map((flock) => (
                                    <tr key={flock._id}>
                                        <td className="border px-4 py-2">{flock.flockName}</td>
                                        <td className="border px-4 py-2">{new Date(flock.startDate).toLocaleDateString('en-GB')}</td>
                                        <td className="border px-4 py-2 space-x-2">
                                            <button
                                                className="text-green-500 hover:text-green-700 mr-3"
                                                onClick={() => handleEdit(flock)} >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(flock._id)}
                                                className="text-red-500 hover:text-red-700">
                                                <FaTrashAlt />
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
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editingFlock ? "Edit Flock" : "Add Flock"}
                            </h2>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsModalOpen(false);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSaveFlock}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Flock Name</label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded"
                                    value={flockName}
                                    onChange={(e) => setFlockName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">Start Date</label>
                                <input
                                    type="date"
                                    className="w-full border px-3 py-2 rounded"
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
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
