import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { addFeedStock, getFeedStocks } from "../app/features/feedStockSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";


const FeedStock = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { feedStocks, summary, isLoading, isError, message } = useSelector(
    (state) => state.feedStock
  );

  const [feedType, setFeedType] = useState("Silage");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseWeight, setPurchaseWeight] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleViewHistory = (feedStock) => {
    navigate(`/feed-history/${feedStock.feedType.toLowerCase()}`, { state: { feedStockId: feedStock._id } });
  };

  useEffect(() => {
    dispatch(getFeedStocks());
  }, [dispatch]);

  const resetForm = () => {
    setFeedType("Silage");
    setPurchasePrice("");
    setPurchaseWeight("");
    setPurchaseDate("");
  };

  const handleSaveFeedStock = async (e) => {
    e.preventDefault();
    const data = {
      feedType,
      purchasePrice,
      purchaseWeight,
      purchaseDate,
    };

    dispatch(addFeedStock(data));
    await dispatch(getFeedStocks())
    resetForm();
    setIsModalOpen(false);
  };



  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add Feed Stock</h2>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium"
          >
            Add Stock
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading && feedStocks.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Loading feedStocks data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b sticky top-0 z-10">
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-center">Sr.</th>
                    <th className="border p-2 text-left">Feed Type</th>
                    <th className="border p-2 text-left">Stock</th>
                    <th className="border p-2 text-left">Purchase History</th>
                  </tr>
                </thead>
                <tbody>
                  {feedStocks?.map((feedStock, index) => (
                    <tr key={feedStock._id} >
                      <td className="border p-2 text-center">{index + 1}</td>
                      <td className="border p-2">{feedStock.feedType}</td>
                      <td className="border p-2">
                        {feedStock.currentStock} KG
                      </td>
                      <td className="border p-2 font-semibold">
                        <button
                          onClick={() => handleViewHistory(feedStock)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm text-sm font-medium"
                        >
                          View History
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>



        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-60">
            <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full transform transition-all">
              <h2 className="text-xl font-bold mb-4">
                Add Feed Stock
              </h2>
              <form onSubmit={handleSaveFeedStock}>
                <div className="mb-4 flex flex-col">
                  <label htmlFor="feedType">Feed Type</label>
                  <select
                    value={feedType}
                    id="feedType"
                    name="feedType"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                    onChange={(e) => setFeedType(e.target.value)}
                  >
                    <option value="Silage">Silage</option>
                    <option value="Wanda">Wanda</option>
                    <option value="Wheat Straw">Wheat Straw</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="purchaseWeight">Purchase Weight</label>
                  <input
                    type="number"
                    min={0}
                    id="purchaseWeight"
                    name="purchaseWeight"
                    placeholder={`Enter ${feedType} in KG`}
                    value={purchaseWeight}
                    onChange={(e) => setPurchaseWeight(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="purchasePrice">Purchase Price</label>
                  <input
                    type="number"
                    min={0}
                    id="purchasePrice"
                    name="purchasePrice"
                    placeholder={`Enter ${feedType} Price Per Kg`}
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
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
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
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
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeedStock;
