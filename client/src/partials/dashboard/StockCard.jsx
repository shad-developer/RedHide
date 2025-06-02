import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeedStocks } from "../../app/features/feedStockSlice";

// Helper function to convert kg to mans and format it
const formatKgAndMans = (kgValue) => {
    const KG_PER_MAN = 40;
    if (typeof kgValue !== 'number' || isNaN(kgValue)) {
        return "0 kg (0 mans)";
    }
    const mansValue = kgValue / KG_PER_MAN;
    // Display mans with 1 decimal place if not an integer, otherwise no decimal
    const formattedMans = Number.isInteger(mansValue) ? mansValue.toString() : mansValue.toFixed(1);
    return `${kgValue} kg (${formattedMans} mans)`;
};

function StockCard() {
    const dispatch = useDispatch();
    const { feedStocks, isLoading } = useSelector(
        (state) => state.feedStock
    );

    useEffect(() => {
        dispatch(getFeedStocks());
    }, [dispatch]);

    const totalKgStock = feedStocks ? feedStocks.reduce((acc, item) => acc + item.currentStock, 0) : 0;

    const KG_PER_MAN = 40; // Define the conversion rate

    const formatMansDisplay = (kg) => {
        if (typeof kg !== 'number' || isNaN(kg)) return '0';
        const mans = kg / KG_PER_MAN;
        return Number.isInteger(mans) ? mans.toString() : mans.toFixed(1);
    };

    return (
        <div className="flex justify-center items-center flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="w-full px-3 pt-3">
                <div className="flex items-baseline justify-center mb-3 text-center">
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
                        {totalKgStock} KG
                    </div>
                    <div className="text-lg font-medium text-slate-500 dark:text-slate-400">
                        ({formatMansDisplay(totalKgStock)} mans)
                    </div>
                </div>
                <div className="text-center mb-4"> {/* Centered title */}
                    <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                        Total Feed Stock
                    </h2>
                </div>
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-3 text-slate-600 dark:text-slate-300">Loading summary...</p>
                        </div>
                    ) : feedStocks && feedStocks.length > 0 ? (
                        feedStocks.map((item) => (
                            <div
                                key={item.feedType}
                                className="flex justify-between items-center text-slate-800 dark:text-slate-100 py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                            >
                                <span className="font-medium">{item.feedType}:</span>
                                <span className="text-slate-600 dark:text-slate-300">
                                    {item.currentStock} kg
                                    <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">
                                        ({formatMansDisplay(item.currentStock)} mans)
                                    </span>
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                            No stock data available.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default StockCard;