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

    // if (isLoading && !flockMedicines) {
    //     return <DashboardLayout><p>Loading Vaccination History...</p></DashboardLayout>;
    // }

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
            <div className="w-full">
                <div className='flex items-center gap-4'>
                    <FaArrowCircleLeft size={24} className="cursor-pointer" title='Go Back' onClick={() => navigate(-1)} />
                    <h2 className="text-2xl font-bold">Vaccination History</h2>
                </div>

                <div className="mb-4 mt-4 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search by vaccine name"
                        value={searchName}
                        onChange={(e) => {
                            setSearchName(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => {
                            setSearchDate(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>



                {/*table*/}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading && flockMedicines.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading vaccinations data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                                    <tr className="bg-gray-50 font-semibold">
                                        <td colSpan={4} className="border p-2 text-right">All Total Cost:</td>
                                        <td className="border p-2 text-right">{`PKR ${totalCost.toFixed(2)} /-`}</td>
                                    </tr>
                                    <tr>
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
                                                    className="text-green-500 hover:text-green-700 mr-3 transition"
                                                    onClick={() => openEditModal(v)}
                                                >
                                                    <FaEdit size={20} />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteVaccination(v._id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <FaTrashAlt size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center">No records found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
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


                {/* Edit Vaccination Modal */}
                {editModalOpen && editVaccination && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-start justify-center z-50 transition-opacity duration-300 ease-in-out"
                        onClick={closeEditModal} // Close on backdrop click
                    >
                        <div
                            className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95"
                            onClick={(e) => e.stopPropagation()} // Prevent close on content click
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Edit Vaccination Record
                                </h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 -m-1"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="editVaccineName" className="block  font-medium text-gray-700 mb-1">Vaccine Name <span className="text-red-500">*</span></label>
                                    <input
                                        id="editVaccineName"
                                        type="text"
                                        placeholder="e.g., Rabies Shield"
                                        value={editVaccination.vaccineName}
                                        onChange={(e) => setEditVaccination({ ...editVaccination, vaccineName: e.target.value })}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  px-3 py-2"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 justify-between">
                                    <div>
                                        <label htmlFor="editVaccinationDate" className="block font-medium text-gray-700 mb-1">Vaccination Date <span className="text-red-500">*</span></label>
                                        <input
                                            id="editVaccinationDate"
                                            type="date"
                                            value={editVaccination.vaccinationDate ? new Date(editVaccination.vaccinationDate).toISOString().split('T')[0] : ''}
                                            onChange={(e) => setEditVaccination({ ...editVaccination, vaccinationDate: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  px-3 py-2"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="editDosage" className="block font-medium text-gray-700 mb-1">Dosage</label>
                                        <input
                                            id="editDosage"
                                            type="text"
                                            placeholder="e.g., 1ml or 1 tablet"
                                            value={editVaccination.dosage}
                                            onChange={(e) => setEditVaccination({ ...editVaccination, dosage: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="editCost" className="block font-medium text-gray-700 mb-1">Cost ($)</label>
                                    <input
                                        id="editCost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={editVaccination.cost}
                                        onChange={(e) => setEditVaccination({ ...editVaccination, cost: parseFloat(e.target.value) || 0 })}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500  px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer/Actions */}
                            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={closeEditModal}
                                    className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateVaccination}
                                    className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                >
                                    Update Record
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </DashboardLayout>
    );
};

export default MedicineHistory;
