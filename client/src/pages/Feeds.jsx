import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../components/common/DashboardLayout";
import ReactPaginate from "react-paginate";
import { getFlocks } from "../app/features/flockSlice";
import { addFeed, getFeeds } from "../app/features/feedSlice";
import { FiX } from "react-icons/fi";

const Feeds = () => {
    const dispatch = useDispatch();

    const { flocks } = useSelector((state) => state.flock);
    const { feeds, loading } = useSelector((state) => state.feed);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeedId, setEditingFeedId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const feedsPerPage = 5;

    const startIndex = currentPage * feedsPerPage;
    const paginatedFeeds = feeds.slice(startIndex, startIndex + feedsPerPage);
    const pageCount = Math.ceil(feeds.length / feedsPerPage);

    // Form state
    const [flockName, setFlockName] = useState("");
    const [silage, setSilage] = useState("");
    const [wanda, setWanda] = useState("");
    const [wheatStraw, setWheatStraw] = useState("");
    const [feedTime, setFeedTime] = useState("Morning");
    const [feedDate, setFeedDate] = useState("");

    useEffect(() => {
        dispatch(getFlocks());
        dispatch(getFeeds());
    }, [dispatch]);

    const resetForm = useCallback(() => {
        setFlockName("");
        setSilage("");
        setWanda("");
        setWheatStraw("");
        setFeedTime("Morning");
        setFeedDate("");
        setEditingFeedId(null);
    }, []);

    const handleSaveFeed = async (e) => {
        e.preventDefault();
        if (!flockName || !feedTime || !feedDate) {
            alert("Please fill in Flock Name, Feed Time, and Feed Date.");
            return;
        }

        const feedData = {
            flockName,
            silage: silage || 0,
            wanda: wanda || 0,
            wheatStraw: wheatStraw || 0,
            feedTime,
            feedDate,
        };

        await dispatch(addFeed(feedData));
        dispatch(getFeeds());
        resetForm();
        setIsModalOpen(false);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5">
                <h1 className="text-xl font-semibold text-gray-800">Feed Management</h1>
                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium"
                    onClick={() => {
                        resetForm(); // Ensure form is clean for adding
                        setIsModalOpen(true);
                    }}
                >
                    Add Feed Record
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {loading && feeds.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading feed data...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10"> {/* Sticky header */}
                                <tr>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Flock Name</th>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Date</th>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Morning Feed (kg)</th>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Evening Feed (kg)</th>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Daily Total (kg)</th>
                                    <th scope="col" className="border px-4 py-3 whitespace-nowrap">Daily/Animal (kg)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {paginatedFeeds.length > 0 ? (
                                    paginatedFeeds.map((feed) => {
                                        const totalAnimals = feed.animalCount || 1;

                                        const morning = feed.morning || {};
                                        const evening = feed.evening || {};

                                        const morningSilage = Number(morning.silage) || 0;
                                        const morningWanda = Number(morning.wanda) || 0;
                                        const morningWheatStraw = Number(morning.wheatStraw) || 0;
                                        const totalMorningFeed = morningSilage + morningWanda + morningWheatStraw;

                                        const eveningSilage = Number(evening.silage) || 0;
                                        const eveningWanda = Number(evening.wanda) || 0;
                                        const eveningWheatStraw = Number(evening.wheatStraw) || 0;
                                        const totalEveningFeed = eveningSilage + eveningWanda + eveningWheatStraw;


                                        const totalMorningFeedInMans = (totalMorningFeed / 40).toFixed(1);
                                        const totalEveningFeedInMans = (totalEveningFeed / 40).toFixed(1);


                                        const dailyTotalSilage = morningSilage + eveningSilage;
                                        const dailyTotalWanda = morningWanda + eveningWanda;
                                        const dailyTotalWheatStraw = morningWheatStraw + eveningWheatStraw;
                                        const overallDailyTotalFeed = totalMorningFeed + totalEveningFeed;

                                        const overallDailyTotalFeedInMann = (overallDailyTotalFeed / 40).toFixed(1);

                                        return (
                                            <tr key={feed._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="border px-4 py-3 font-medium text-gray-900 whitespace-nowrap align-top">
                                                    {feed.flockName?.flockName || 'N/A'}
                                                </td>
                                                <td className="border px-4 py-3 text-gray-600 whitespace-nowrap align-top">
                                                    {new Date(feed.feedDate).toLocaleDateString('en-GB')}
                                                </td>
                                                {/* Morning Feed Details */}
                                                <td className="border px-4 py-3 align-top">
                                                    <div className="space-y-0.5 text-sm">
                                                        <p><span className="text-gray-500">Silage:</span> {morningSilage} Kg</p>
                                                        <p><span className="text-gray-500">Wanda:</span> {morningWanda} Kg</p>
                                                        <p><span className="text-gray-500">WheatStraw:</span> {morningWheatStraw} Kg</p>
                                                        {totalMorningFeed > 0 && (
                                                            <p className="font-semibold border-t border-gray-200 mt-1 pt-1">
                                                                Total: {totalMorningFeed.toFixed(1)} Kg
                                                                <br />
                                                                {totalMorningFeedInMans} mann
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Evening Feed Details */}
                                                <td className="border px-4 py-3 align-top">
                                                    <div className="space-y-0.5 text-sm">
                                                        <p><span className="text-gray-500">Silage:</span> {eveningSilage} Kg</p>
                                                        <p><span className="text-gray-500">Wanda:</span> {eveningWanda} Kg</p>
                                                        <p><span className="text-gray-500">WheatStraw:</span> {eveningWheatStraw} Kg</p>
                                                        {totalEveningFeed > 0 && (
                                                            <p className="font-semibold border-t border-gray-200 mt-1 pt-1">
                                                                Total: {totalEveningFeed.toFixed(1)} Kg
                                                                <br />
                                                                {totalEveningFeedInMans} mann
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                {/* Daily Total Feed */}
                                                <td className="border px-4 py-3 align-top">
                                                    <div className="space-y-0.5 text-sm">
                                                        <p><span className="text-gray-500">Silage:</span> {dailyTotalSilage} Kg</p>
                                                        <p><span className="text-gray-500">Wanda:</span> {dailyTotalWanda} Kg</p>
                                                        <p><span className="text-gray-500">WheatStraw:</span> {dailyTotalWheatStraw} Kg</p>
                                                        <p className="font-bold text-gray-800 border-t border-gray-300 mt-1 pt-1">
                                                            Total: {overallDailyTotalFeed.toFixed(1)} Kg
                                                            <br />
                                                            {overallDailyTotalFeedInMann} mann
                                                        </p>
                                                    </div>
                                                </td>
                                                {/* Daily Feed Per Animal */}
                                                <td className="px-4 py-3 align-top">
                                                    {totalAnimals > 0 ? (
                                                        <div className="space-y-0.5 text-sm">
                                                            <p><span className="text-gray-500">Silage:</span> {(dailyTotalSilage / totalAnimals).toFixed(2)} Kg</p>
                                                            <p><span className="text-gray-500">Wanda:</span> {(dailyTotalWanda / totalAnimals).toFixed(2)} Kg</p>
                                                            <p><span className="text-gray-500">WheatStraw:</span> {(dailyTotalWheatStraw / totalAnimals).toFixed(2)} Kg</p>
                                                            <p className="font-bold text-gray-800 border-t border-gray-300 mt-1 pt-1">
                                                                Total: {(overallDailyTotalFeed / totalAnimals).toFixed(2)} Kg
                                                                <br />
                                                                {((overallDailyTotalFeed / totalAnimals) / 40).toFixed(2)} mann
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs italic text-gray-500">N/A</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500"> {/* Adjusted colSpan */}
                                            {/* ... empty state SVG and text ... */}
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                                </svg>
                                                <p className="font-semibold text-gray-700">No feed data found.</p>
                                                <p className="text-xs text-gray-400">Try adding a new feed record.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pagination (only if there are pages to show) */}
                {pageCount > 1 && (
                    <div className="sticky bottom-0 bg-white px-4 py-3 border-t flex flex-col xs:flex-row items-center xs:justify-between z-20"> {/* Ensure pagination is above content */}
                        {/* ... ReactPaginate component ... */}
                        <ReactPaginate
                            previousLabel={"Prev"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            onPageChange={handlePageClick} // Ensure handlePageClick is defined in your component
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


            {/* Modal for Add/Edit Feed */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white p-5 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingFeedId ? "Edit Feed Record" : "Add New Feed Record"}
                            </h2>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setIsModalOpen(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                                title="Close"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveFeed} className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            <div>
                                <label htmlFor="flockName" className="block text-sm font-medium text-gray-700 mb-1">Flock Name <span className="text-red-500">*</span></label>
                                <select
                                    id="flockName"
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                    value={flockName}
                                    onChange={(e) => setFlockName(e.target.value)}
                                    required
                                >
                                    <option value="">Select Flock</option>
                                    {flocks?.map((flock) => ( // Optional chaining for flocks
                                        <option key={flock._id} value={flock._id}>
                                            {flock.flockName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Feed Amounts in a Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="silage" className="block text-sm font-medium text-gray-700 mb-1">Silage (kg)</label>
                                    <input
                                        id="silage" type="number" step="0.1" min="0"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        placeholder="0.0" value={silage} onChange={(e) => setSilage(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="wanda" className="block text-sm font-medium text-gray-700 mb-1">Wanda (kg)</label>
                                    <input
                                        id="wanda" type="number" step="0.1" min="0"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        placeholder="0.0" value={wanda} onChange={(e) => setWanda(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="wheatStraw" className="block text-sm font-medium text-gray-700 mb-1">Wheat Straw (kg)</label>
                                    <input
                                        id="wheatStraw" type="number" step="0.1" min="0"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        placeholder="0.0" value={wheatStraw} onChange={(e) => setWheatStraw(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="feedTime" className="block text-sm font-medium text-gray-700 mb-1">Feed Time <span className="text-red-500">*</span></label>
                                    <select
                                        id="feedTime"
                                        value={feedTime}
                                        onChange={(e) => setFeedTime(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        required
                                    >
                                        <option value="Morning">Morning</option>
                                        <option value="Evening">Evening</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="feedDate" className="block text-sm font-medium text-gray-700 mb-1">Feed Date <span className="text-red-500">*</span></label>
                                    <input
                                        id="feedDate" type="date"
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                                        value={feedDate} onChange={(e) => setFeedDate(e.target.value)} required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t mt-auto"> {/* Sticky footer for modal */}
                                <button
                                    type="button"
                                    onClick={() => { resetForm(); setIsModalOpen(false); }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition shadow-sm"
                                >
                                    {editingFeedId ? "Update Record" : "Save Record"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Feeds;