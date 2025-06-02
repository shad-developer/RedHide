import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import ReactPaginate from 'react-paginate';
import { FaArrowCircleLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { deleteFeedHistory, getFeedStockById, updateFeedHistory } from '../app/features/feedStockSlice';
import { useDispatch, useSelector } from 'react-redux';

const FeedHistory = () => {
    const location = useLocation();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // get stock id from location state
    const stockId = location.state?.feedStockId;

    const { feedStock, isLoading } = useSelector((state) => state.feedStock);

    // modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingHistoryItem, setEditingHistoryItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        purchaseDate: '',
        purchaseWeight: '',
        pricePerUnit: '',
    });

    useEffect(() => {
        if (stockId) {
            dispatch(getFeedStockById(stockId));
        }
    }, [stockId, dispatch]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const FEED_STOCKS_PER_PAGE = 10;


    const dateFilteredHistory = feedStock?.purchaseHistory?.filter((history) =>
        searchTerm ? new Date(history.purchaseDate).toISOString().split('T')[0] === searchTerm : true
    ) || [];

    const offset = currentPage * FEED_STOCKS_PER_PAGE;
    const currentItems = dateFilteredHistory.slice(offset, offset + FEED_STOCKS_PER_PAGE);
    const pageCount = Math.ceil(dateFilteredHistory.length / FEED_STOCKS_PER_PAGE);

    const handlePageClick = ({ selected }) => setCurrentPage(selected);

    const handleDeleteHistory = async (historyId) => {
        if (window.confirm('Are you sure you want to delete this history item?')) {
            await dispatch(deleteFeedHistory({ feedStockId: stockId, historyId }));
            // Re-fetch or let Redux update the state ideally
            dispatch(getFeedStockById(stockId));
        }
    };


    //edit stock 
    const openEditModal = (historyItem) => {
        setEditingHistoryItem(historyItem);
        setEditFormData({
            purchaseDate: new Date(historyItem.purchaseDate).toISOString().split('T')[0],
            purchaseWeight: historyItem.purchaseWeight.toString(),
            pricePerUnit: historyItem.pricePerUnit.toString(),
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingHistoryItem(null);
        setEditFormData({ purchaseDate: '', purchaseWeight: '', pricePerUnit: '' });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingHistoryItem) return;

        const updatedData = {
            purchaseDate: editFormData.purchaseDate,
            purchaseWeight: parseFloat(editFormData.purchaseWeight),
            pricePerUnit: parseFloat(editFormData.pricePerUnit),
        };

        await dispatch(updateFeedHistory({
            feedStockId: stockId,
            historyId: editingHistoryItem._id,
            updatedData,
        }));
        closeEditModal();
        dispatch(getFeedStockById(stockId));
    };


    // loader
    if (isLoading && !feedStock) {
        return <DashboardLayout><p>Loading Feed History...</p></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <div className="w-full p-6">
                <div className='flex items-center gap-5'>
                    <FaArrowCircleLeft size={24} className="cursor-pointer" title='Go Back' onClick={() => navigate(-1)} />

                    <h2 className="text-2xl font-bold">{feedStock?.feedType} Purchase History</h2>
                </div>

                <div className="mt-4 flex gap-4">
                    <input
                        type="date"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="px-3 py-2 border rounded"
                    />
                </div>

                <div className="overflow-x-auto mt-5">
                    <table className="table-auto w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 font-semibold">
                                <td colSpan={4} className="border p-2 text-right">
                                    All Total:
                                </td>
                                <td className="border p-2 text-right">
                                    {`${dateFilteredHistory.reduce((acc, feedStock) => acc + (feedStock.pricePerUnit * feedStock.purchaseWeight), 0).toFixed(2)} /-`}
                                </td>
                            </tr>

                            {/* Actual Column Headers */}
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Date</th>
                                <th className="border p-2 text-left">Weight (KG)</th>
                                <th className="border p-2 text-left">Price Per KG</th>
                                <th className="border p-2 text-left">Total Price</th>
                                <th className="border p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map((history, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border p-2">{new Date(history.purchaseDate).toLocaleDateString('en-GB')}</td>
                                    <td className="border p-2">{history.purchaseWeight.toFixed(2)} KG</td>
                                    <td className="border p-2">{history.pricePerUnit.toFixed(2)} /-</td>
                                    <td className="border p-2">{(history.purchaseWeight * history.pricePerUnit).toFixed(2)} /-</td>
                                    <td className="border p-2">
                                        <div className='flex items-center gap-4'>
                                            <FaEdit size={18} className='text-blue-500 hover:text-blue-700 cursor-pointer' title="Edit" onClick={() => openEditModal(history)} />
                                            <FaTrash size={18} className='text-red-500' onClick={() => handleDeleteHistory(history._id)} />
                                        </div>

                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center">No records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"flex justify-center items-center gap-2"}
                        previousClassName={"px-3 py-2 bg-gray-200 rounded"}
                        nextClassName={"px-3 py-2 bg-gray-200 rounded"}
                        pageClassName={
                            "px-3 py-2 cursor-pointer bg-gray-100 hover:bg-gray-300 rounded"
                        }
                        activeClassName={"bg-green-500 text-white"}
                    />
                </div>
            </div>



            {/* Edit Modal */}
            {isEditModalOpen && editingHistoryItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Edit Purchase History</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="editPurchaseDate" className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                                <input
                                    type="date"
                                    id="editPurchaseDate"
                                    name="purchaseDate"
                                    value={editFormData.purchaseDate}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="editPurchaseWeight" className="block text-sm font-medium text-gray-700 mb-1">Purchase Weight (KG)</label>
                                <input
                                    type="number"
                                    id="editPurchaseWeight"
                                    name="purchaseWeight"
                                    value={editFormData.purchaseWeight}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="editPricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">Price Per KG</label>
                                <input
                                    type="number"
                                    id="editPricePerUnit"
                                    name="pricePerUnit"
                                    value={editFormData.pricePerUnit}
                                    onChange={handleEditFormChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    disabled={isLoading} // Disable button while any loading is true
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default FeedHistory;
