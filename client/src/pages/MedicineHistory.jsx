import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import ReactPaginate from 'react-paginate';
import { FaArrowCircleLeft, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVaccinationById, getMedicineByFlockId, updateVaccinationById } from '../app/features/medicineSlice';

const MedicineHistory = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const flockId = location.state?.flockId;

    const { flockMedicines, isLoading } = useSelector((state) => state.medicine);


    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editVaccination, setEditVaccination] = useState(null);


    const ITEMS_PER_PAGE = 5;

    useEffect(() => {
        if (flockId) {
            dispatch(getMedicineByFlockId(flockId));
        }
    }, [flockId, dispatch]);

    const filteredVaccinations = (flockMedicines?.vaccination || []).filter((v) => {
        const matchesName = searchName ? v.vaccineName?.toLowerCase().includes(searchName.toLowerCase()) : true;
        const matchesDate = searchDate ? new Date(v.vaccinationDate).toISOString().split('T')[0] === searchDate : true;
        return matchesName && matchesDate;
    });


    const offset = currentPage * ITEMS_PER_PAGE;
    const currentItems = filteredVaccinations.slice(offset, offset + ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filteredVaccinations.length / ITEMS_PER_PAGE);

    const handlePageClick = ({ selected }) => setCurrentPage(selected);

    const totalCost = flockMedicines?.totalCost || 0;

    if (isLoading && !flockMedicines) {
        return <DashboardLayout><p>Loading Vaccination History...</p></DashboardLayout>;
    }

    const openEditModal = (vaccination) => {
        setEditVaccination(vaccination);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setEditVaccination(null);
    };

    const handleUpdateVaccination = async () => {
        if (!editVaccination) return;

        await dispatch(updateVaccinationById({ flockId, vaccination: editVaccination }));
        dispatch(getMedicineByFlockId(flockId));
        closeEditModal();
    };

    const handleDeleteVaccination = async (vaccinationId) => {
        await dispatch(deleteVaccinationById({ flockId, vaccinationId }))
        dispatch(getMedicineByFlockId(flockId));
    }

    return (
        <DashboardLayout>
            <div className="w-full p-6">
                <div className='flex items-center gap-5'>
                    <FaArrowCircleLeft size={24} className="cursor-pointer" title='Go Back' onClick={() => navigate(-1)} />
                    <h2 className="text-2xl font-bold">Vaccination History</h2>
                </div>

                <div className="mt-4 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by vaccine name"
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border rounded"
                    />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => {
                            setSearchDate(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border rounded"
                    />
                </div>

                <div className="overflow-x-auto mt-5">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 font-semibold">
                                <td colSpan={4} className="border p-2 text-right">All Total Cost:</td>
                                <td className="border p-2 text-right">{`PKR ${totalCost.toFixed(2)} /-`}</td>
                            </tr>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Vaccine Name</th>
                                <th className="border p-2 text-left">Vaccination Date</th>
                                <th className="border p-2 text-left">Dosage</th>
                                <th className="border p-2 text-left">Cost</th>
                                <th className="border p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map((v, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border p-2">{v.vaccineName}</td>
                                    <td className="border p-2">{new Date(v.vaccinationDate).toLocaleDateString('en-GB')}</td>
                                    <td className="border p-2">{v.dosage}</td>
                                    <td className="border p-2">{v.cost?.toFixed(2)} /-</td>
                                    <td className="border p-2">
                                        <button
                                            title="Edit"
                                            className="text-blue-500 hover:text-blue-700 mr-3 transition"
                                            onClick={() => openEditModal(v)}
                                        >
                                            <FaEdit size={16} />
                                        </button>
                                        <button
                                            title="Delete"
                                            onClick={() => handleDeleteVaccination(v._id)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <FaTrashAlt size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col xs:flex-row items-center xs:justify-between mt-6">
                        <ReactPaginate
                            previousLabel={"Prev"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            containerClassName={"inline-flex items-center -space-x-px text-sm"}
                            pageLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"}
                            previousLinkClassName={"flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"}
                            nextLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"}
                            breakLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"}
                            activeLinkClassName={"z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 dark:text-white border border-blue-300 dark:border-blue-500 bg-blue-50 dark:bg-blue-600 hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-700 dark:hover:text-white"}
                            disabledLinkClassName={"opacity-50 cursor-not-allowed"}
                        />
                    </div>
                )}


                {/* Edit Modal */}
                {editModalOpen && editVaccination && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-md shadow-md w-96">
                            <h3 className="text-lg font-semibold mb-4">Edit Vaccination</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Vaccine Name"
                                    value={editVaccination.vaccineName}
                                    onChange={(e) => setEditVaccination({ ...editVaccination, vaccineName: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="date"
                                    value={new Date(editVaccination.vaccinationDate).toISOString().split('T')[0]}
                                    onChange={(e) => setEditVaccination({ ...editVaccination, vaccinationDate: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Dosage"
                                    value={editVaccination.dosage}
                                    onChange={(e) => setEditVaccination({ ...editVaccination, dosage: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                                <input
                                    type="number"
                                    placeholder="Cost"
                                    value={editVaccination.cost}
                                    onChange={(e) => setEditVaccination({ ...editVaccination, cost: e.target.value })}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={closeEditModal} className="px-4 py-2 border rounded">Cancel</button>
                                <button onClick={handleUpdateVaccination} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MedicineHistory;
