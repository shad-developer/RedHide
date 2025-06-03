import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FaEdit, FaRegEye, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { addMedicineToFlock, deleteMedicineById, getAllMedicine } from "../app/features/medicineSlice";
import { getFlocks } from "../app/features/flockSlice";
import { useNavigate } from "react-router-dom";

const Meditation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { medicines: vaccinations, isLoading, isDeleteSuccess } = useSelector((state) => state.medicine);
    const { flocks } = useSelector((state) => state.flock);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    // Form State
    const [selectedFlockId, setSelectedFlockId] = useState("");
    const [vaccineName, setVaccineName] = useState("");
    const [vaccinationDate, setVaccinationDate] = useState("");
    const [dosage, setDosage] = useState("");
    const [cost, setCost] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search State
    const [searchFlockName, setSearchFlockName] = useState("");
    const [searchVaccine, setSearchVaccine] = useState("");


    const resetForm = () => {
        setSelectedFlockId("");
        setVaccineName("");
        setVaccinationDate("");
        setDosage("");
        setCost("");
    };


    useEffect(() => {
        dispatch(getFlocks());
        dispatch(getAllMedicine());
    }, [dispatch]);


    // // Filtering logic
    const filteredVaccinations = Array.isArray(vaccinations)
        ? vaccinations.filter((vaccination) => {
            const flockMatch = searchFlockName === "" || vaccination?.flock?.flockName?.toLowerCase().includes(searchFlockName.toLowerCase());
            const vaccineNameMatch = searchVaccine === "" || vaccination?.vaccineName?.toLowerCase().includes(searchVaccine.toLowerCase());
            return flockMatch && vaccineNameMatch;
        })
        : [];

    // Pagination after filtering
    const offset = currentPage * itemsPerPage;
    const currentVaccinations = filteredVaccinations.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredVaccinations.length / itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleSaveVaccination = async (e) => {
        e.preventDefault();
        if (!selectedFlockId || !vaccineName || !vaccinationDate) {
            alert("Please fill all required fields: Flock, Animal, Vaccine Name, and Date.");
            return;
        }

        const vaccinationData = {
            vaccineName,
            vaccinationDate,
            dosage,
            cost: cost ? Number(cost) : undefined,
        };

        await dispatch(addMedicineToFlock({ formData: vaccinationData, flockId: selectedFlockId }));
        setIsModalOpen(false);
        resetForm();
        dispatch(getAllMedicine())
    };


    const handleDeleteVaccination = async (medicineId) => {
        const confirmed = window.confirm("Are you sure you want to delete this vaccination record?");
        if (confirmed) {
            await dispatch(deleteMedicineById(medicineId));
        }
        window.location.reload();
    };


    const handleViewVaccinations = (vaccination) => {

        let flockName = vaccination.flockId.flockName;
        flockName = flockName.replace(/^\d+\s*/, "");
        flockName = flockName.replace(/[^a-zA-Z0-9\s-]/g, "");
        const sanitizedName = flockName.trim().toLowerCase().replace(/\s+/g, "-");
        navigate(`/medicine-history/${sanitizedName}`, { state: { flockId: vaccination.flockId._id, vaccinationId: vaccination._id } });
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Meditation</h2>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium">
                    Add Medicines
                </button>
            </div>

            {/* Search Filters */}
            <div className="mb-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Search Flock Name..."
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={searchFlockName}
                    onChange={(e) => setSearchFlockName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Search Vaccine Name..."
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    value={searchVaccine}
                    onChange={(e) => setSearchVaccine(e.target.value)}
                />
            </div>


            {/*table*/}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {isLoading && vaccinations.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading vaccinations data...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="border p-2 text-center">Sr.</th>
                                    <th className="border p-2 text-left">Flock Name</th>
                                    <th className="border p-2 text-left">Total Cost</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentVaccinations.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="p-3 text-center text-gray-500 dark:text-gray-400">
                                            No vaccination records found.
                                        </td>
                                    </tr>
                                ) : (
                                    currentVaccinations.map((vaccination, index) => (
                                        <tr key={vaccination._id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="border p-2 text-center">{offset + index + 1}</td>
                                            <td className="border p-2">{vaccination.flockId?.flockName || 'N/A'}</td>
                                            <td className="border p-2">{vaccination.totalCost ? `PKR ${vaccination.totalCost.toFixed(2)}/-` : '-'}</td>
                                            <td className="border p-2">
                                                <button
                                                    title="View History"
                                                    className="text-green-500 hover:text-green-700 mr-3 transition"
                                                    onClick={() => handleViewVaccinations(vaccination)}
                                                >
                                                    <FaRegEye size={20} />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    onClick={() => handleDeleteVaccination(vaccination._id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <FaTrashAlt size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit Vaccination */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                            Add New Medicine
                        </h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Flock Name <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    value={selectedFlockId}
                                    onChange={(e) => {
                                        setSelectedFlockId(e.target.value);
                                    }}
                                    required
                                >
                                    <option value="">Select Flock</option>
                                    {flocks?.map((flock) => (
                                        <option key={flock._id} value={flock._id}>
                                            {flock.flockName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="vaccineName" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Vaccine Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="vaccineName"
                                    placeholder="e.g., Newcastle B1"
                                    value={vaccineName}
                                    onChange={(e) => setVaccineName(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="vaccinationDate" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Vaccination Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        id="vaccinationDate"
                                        value={vaccinationDate}
                                        onChange={(e) => setVaccinationDate(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="dosage" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</label>
                                    <input
                                        type="text"
                                        id="dosage"
                                        placeholder="e.g., 0.5ml"
                                        value={dosage}
                                        onChange={(e) => setDosage(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="cost" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Cost PKR</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    id="cost"
                                    placeholder="e.g.. 1150"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(false);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveVaccination}
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                    disabled={isLoading}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
        </DashboardLayout>
    );
};

export default Meditation;