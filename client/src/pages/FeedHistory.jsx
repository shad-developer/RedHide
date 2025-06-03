import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import ReactPaginate from 'react-paginate';
import { FaArrowCircleLeft, FaEdit, FaTrashAlt } from 'react-icons/fa';
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


    // // loader
    // if (isLoading && !feedStock) {
    //     return <DashboardLayout><p>Loading Feed History...</p></DashboardLayout>;
    // }

    return (
        <DashboardLayout>
            <div className="w-full">
                <div className='flex items-center gap-5'>
                    <FaArrowCircleLeft size={24} className="cursor-pointer" title='Go Back' onClick={() => navigate(-1)} />
                    <h2 className="text-2xl font-bold">{feedStock?.feedType} Purchase History</h2>
                </div>
                <div className="mt-4 mb-2 flex gap-4">
                    <input
                        type="date"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(0);
                        }}
                        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {isLoading && feedStock?.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            Loading feedStock data...
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-700">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                                    <tr className="bg-gray-50 font-semibold">
                                        <td colSpan={4} className="border p-2 text-right">
                                            All Total:
                                        </td>
                                        <td className="border p-2 text-right">
                                            {`${dateFilteredHistory.reduce((acc, feedStock) => acc + (feedStock.pricePerUnit * feedStock.purchaseWeight), 0).toFixed(2)} /-`}
                                        </td>
                                    </tr>
                                    <tr>
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
                                                    <FaEdit size={20} className='text-green-500 hover:text-green-700 cursor-pointer' title="Edit" onClick={() => openEditModal(history)} />
                                                    <FaTrashAlt size={18} className='text-red-500 cursor-pointer hover:text-red-700' onClick={() => handleDeleteHistory(history._id)} />
                                                </div>

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

            </div>



            {/* Edit Modal */}
            {isEditModalOpen && editingHistoryItem && (
                <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-60">
                    <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full transform transition-all">
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
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
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
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
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
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
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
