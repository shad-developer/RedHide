import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { addAnimal, deleteAnimal, getAnimals, updateAnimal } from "../app/features/animalSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { getFlocks } from "../app/features/flockSlice";

const Animals = () => {

    const dispatch = useDispatch();
    const { animals, isLoading, isError, message } = useSelector((state) => state.animal);
    const { flocks } = useSelector((state) => state.flock);

    const [currentPage, setCurrentPage] = useState(0);
    const animalsPerPage = 5;

    const [flockName, setFlockName] = useState("")
    const [tagNumber, setTagNumber] = useState("")
    const [purchasePrice, setPurchasePrice] = useState("")
    const [purchaseWeight, setPurchaseWeight] = useState("")
    const [purchaseDate, setPurchaseDate] = useState("")
    const [file, setFile] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const [editingAnimalId, setEditingAnimalId] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);

    const [searchFlockName, setSearchFlockName] = useState("");
    const [searchTagNumber, setSearchTagNumber] = useState("");


    const resetForm = () => {
        setFlockName("");
        setTagNumber("");
        setPurchasePrice("");
        setPurchaseWeight("");
        setPurchaseDate("");
        setFile(null);
        setEditingAnimalId(null)
        setCurrentImageUrl(null)
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const previewUrl = URL.createObjectURL(selectedFile);
            setFile({
                file: selectedFile,
                preview: previewUrl,
            });
            setCurrentImageUrl(null);
            e.target.value = "";
        }
    };


    // Filtering logic based on search inputs
    const filteredAnimals = Array.isArray(animals)
        ? animals.filter((animal) => {
            return (
                animal?.flock?.flockName?.toLowerCase().includes(searchFlockName.toLowerCase()) &&
                animal.tagNumber?.toLowerCase().includes(searchTagNumber.toLowerCase())
            );
        })
        : [];

    // Pagination after filtering
    const offset = currentPage * animalsPerPage;
    const currentAnimals = filteredAnimals.slice(offset, offset + animalsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        dispatch(getAnimals())
        dispatch(getFlocks())
    }, [dispatch])

    const pageCount = Math.ceil(filteredAnimals.length / animalsPerPage);


    const handleSaveAnimal = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("flockName", flockName);
        formData.append("tagNumber", tagNumber);
        formData.append("purchasePrice", purchasePrice);
        formData.append("purchaseWeight", purchaseWeight);
        formData.append("purchaseDate", purchaseDate);
        if (file) {
            formData.append("image", file.file);
        }

        if (editingAnimalId === null) {
            await dispatch(addAnimal(formData));
        } else {
            formData.append("_id", editingAnimalId);
            await dispatch(updateAnimal(formData));
        }

        setIsModalOpen(false);
        resetForm();
        dispatch(getAnimals());
    };


    const handleEditAnimal = async (animal) => {
        setEditingAnimalId(animal._id);
        setFlockName(animal?.flock?._id);
        setTagNumber(animal.tagNumber);
        setPurchasePrice(animal.purchasePrice);
        setPurchaseWeight(animal.purchaseWeight);
        setPurchaseDate(new Date(animal.purchaseDate).toISOString().split('T')[0]);
        setCurrentImageUrl(animal?.image?.filePath);
        setFile(null);
        setIsModalOpen(true);
    }


    const handleDeleteAnimal = async (animalId) => {
        const confirmed = window.confirm("Are you sure you want to delete this animal?");
        if (confirmed) {
            await dispatch(deleteAnimal(animalId));
            dispatch(getAnimals());
        }
    };

    const handleImageModalClick = (animal) => {
        setSelectedImage(animal?.image?.filePath);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setImageModalOpen(false);
        setSelectedImage(null);
    };


    return (
        <DashboardLayout>
            <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Animals</h2>
                    <button onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium">
                        Add Animal
                    </button>
                </div>

                {/*search inputs*/}
                <div className="mb-4 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search Flock Name"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={searchFlockName}
                        onChange={(e) => setSearchFlockName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search Tag Number"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        value={searchTagNumber}
                        onChange={(e) => setSearchTagNumber(e.target.value)}
                    />
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading && animals.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading feed data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                                    <tr className="bg-gray-100">
                                        <th className="border p-2 text-center">Sr.</th>
                                        <th className="border p-2 text-left">Image</th>
                                        <th className="border p-2 text-left">Flock Name</th>
                                        <th className="border p-2 text-left">Tag Number</th>
                                        <th className="border p-2 text-left">Purchase Price</th>
                                        <th className="border p-2 text-left">Purchase Weight (KG)</th>
                                        <th className="border p-2 text-left">Purchase Date</th>
                                        <th className="border p-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan="6" className="border p-2 text-center">
                                                Loading animals...
                                            </td>
                                        </tr>
                                    ) : (
                                        currentAnimals?.map((animal, index) => (
                                            <tr key={animal._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="border p-2 text-center">{index + 1}</td>
                                                <td className="border p-2 cursor-pointer" title="View Image" onClick={() => handleImageModalClick(animal)}>
                                                    <img
                                                        src={animal?.image?.filePath}
                                                        alt={animal?.name}
                                                        className="w-16 h-16 rounded object-cover"
                                                    />
                                                </td>
                                                <td className="border p-2">{animal?.flock?.flockName}</td>
                                                <td className="border p-2">{animal?.tagNumber}</td>
                                                <td className="border p-2">{animal?.purchasePrice}</td>
                                                <td className="border p-2">{animal?.purchaseWeight}</td>
                                                <td className="border p-2">{new Date(animal?.purchaseDate).toLocaleDateString('en-GB')}</td>
                                                <td className="border p-2">
                                                    <button
                                                        className="text-green-500 hover:text-green-700 mr-3"
                                                        onClick={() => handleEditAnimal(animal)}
                                                    >
                                                        <FaEdit  size={20}/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAnimal(animal?._id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FaTrashAlt size={18}/>
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


                {imageModalOpen && (
                    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-60">
                        <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full transform transition-all relative">
                            <button
                                className="absolute top-2 right-2 text-red-500"
                                onClick={closeImageModal}
                            >
                                <MdCancel size={30} title="Close" />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Animal"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                )}


                {/* open modal for adding/editing new animal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-60">
                        <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full transform transition-all">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {editingAnimalId !== null ? "Edit Animal Details" : "Add New Animal"}
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

                            {/* Form Body */}
                            <form onSubmit={handleSaveAnimal} className="mt-4 space-y-4">
                                {/* Flock Name & Tag Number (Side-by-side on larger screens) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="flockName" className="block text-sm font-medium text-gray-700 mb-1">Flock Name <span className="text-red-500">*</span></label>
                                        <select
                                            id="flockName"
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                            value={flockName}
                                            onChange={(e) => setFlockName(e.target.value)}
                                            required
                                        >
                                            <option value="">Select Flock</option>
                                            {flocks &&
                                                flocks.map((flock) => (
                                                    <option key={flock._id} value={flock._id}>
                                                        {flock.flockName}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="tagNumber" className="block text-sm font-medium text-gray-700 mb-1">Tag Number</label>
                                        <input
                                            type="text"
                                            id="tagNumber"
                                            name="tagNumber"
                                            placeholder="e.g., A001"
                                            value={tagNumber}
                                            onChange={(e) => setTagNumber(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.01" // For currency
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        placeholder="0.00"
                                        value={purchasePrice}
                                        onChange={(e) => setPurchasePrice(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="purchaseWeight" className="block text-sm font-medium text-gray-700 mb-1">Purchase Weight (KG)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        step="0.1"
                                        id="purchaseWeight"
                                        name="purchaseWeight"
                                        placeholder="e.g., 45.5"
                                        value={purchaseWeight}
                                        onChange={(e) => setPurchaseWeight(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                                    <input
                                        type="date"
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        value={purchaseDate}
                                        onChange={(e) => setPurchaseDate(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Animal Image</label>
                                    <div className="mt-1 flex items-center space-x-4">
                                        {currentImageUrl && !file?.preview && (
                                            <img
                                                src={currentImageUrl}
                                                alt="Current"
                                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                            />
                                        )}
                                        {file?.preview && (
                                            <img
                                                src={file.preview}
                                                alt="New Preview"
                                                className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                            />
                                        )}
                                        <label htmlFor="animalImageFile" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                            <span>{file || currentImageUrl ? "Change" : "Upload"} Image</span>
                                            <input
                                                id="animalImageFile"
                                                type="file"
                                                name="image"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="sr-only" // Hide the default input
                                            />
                                        </label>
                                    </div>
                                    {file && !file.preview && <p className="text-xs text-gray-500 mt-1">{file.name}</p>}
                                </div>

                                {/* Footer Actions */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
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
                                        {editingAnimalId !== null ? "Update Animal" : "Save Animal"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}




                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="sticky bottom-0 bg-white px-4 py-3 border-t flex flex-col xs:flex-row items-center xs:justify-between">
                        <ReactPaginate
                            previousLabel={"Prev"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            containerClassName={"inline-flex items-center -space-x-px text-sm"}
                            pageLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}
                            previousLinkClassName={"flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"}
                            nextLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"}
                            breakLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"}
                            activeLinkClassName={"z-10 flex items-center justify-center px-3 h-8 leading-tight text-indigo-600 border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700"}
                            disabledLinkClassName={"opacity-50 cursor-not-allowed"}
                        />
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Animals;
