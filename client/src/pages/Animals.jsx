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
            <div className="w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Animals</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add Animal
                    </button>
                </div>
                <div className="mb-4 flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search Flock Name"
                        className="px-3 py-2 border rounded"
                        value={searchFlockName}
                        onChange={(e) => setSearchFlockName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Search Tag Number"
                        className="px-3 py-2 border rounded"
                        value={searchTagNumber}
                        onChange={(e) => setSearchTagNumber(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Sr.</th>
                                <th className="border p-2 text-left">Image</th>
                                <th className="border p-2 text-left">Flock Name</th>
                                <th className="border p-2 text-left">Tag Number</th>
                                <th className="border p-2 text-left">Purchase Price</th>
                                <th className="border p-2 text-left">Purchase Weight (KG)</th>
                                <th className="border p-2 text-left">Purchase Date</th>
                                <th className="border p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="border p-2 text-center">
                                        Loading animals...
                                    </td>
                                </tr>
                            ) : (
                                currentAnimals?.map((animal, index) => (
                                    <tr key={animal._id} className="hover:bg-gray-50">
                                        <td className="border p-2">{index + 1}</td>
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
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAnimal(animal?._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {imageModalOpen && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-5xl w-full relative">
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

                {/* open modal for adding new animal */}

                {isModalOpen && (
                    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-4">
                                {editingAnimalId !== null ? "Edit" : "Add"} Animal
                            </h2>
                            <form onSubmit={handleSaveAnimal} >
                                <div className="mb-4">
                                    <label className="block mb-1 font-medium">Flock Name</label>
                                    <select
                                        className="w-full border px-3 py-2 rounded"
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
                                <div className="mb-4">
                                    <label htmlFor="tagNumber">Tag Number</label>
                                    <input
                                        type="text"
                                        id="tagNumber"
                                        name="tagNumber"
                                        placeholder="Tag Number"
                                        value={tagNumber}
                                        onChange={(e) => setTagNumber(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="purchasePrice">Purchase Price</label>
                                    <input
                                        type="number"
                                        min={0}
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        placeholder="Purchase Price"
                                        value={purchasePrice}
                                        onChange={(e) => setPurchasePrice(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="purchaseWeight">Purchase Weight (KG)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        id="purchaseWeight"
                                        name="purchaseWeight"
                                        placeholder="Purchase Weight In KG"
                                        value={purchaseWeight}
                                        onChange={(e) => setPurchaseWeight(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="purchaseDate">Purchase Date</label>
                                    <input
                                        type="date"
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        value={purchaseDate}
                                        onChange={(e) => setPurchaseDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    {currentImageUrl && (
                                        <div className="mb-2">
                                            <img
                                                src={currentImageUrl}
                                                alt="Current"
                                                className="w-32 h-32 object-cover rounded mt-1"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    {file?.preview && (
                                        <div className="mt-2">
                                            <img
                                                src={file.preview}
                                                alt="New Preview"
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-2 mt-5">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetForm()
                                            setIsModalOpen(false)
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                    >
                                        {editingAnimalId !== null ? "Update" : "Save"}
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
