import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaw } from "react-icons/fa"; 
import { getFlocks } from "../../app/features/flockSlice";

function FlockCard() {
    const dispatch = useDispatch();
    const { flocks, isLoading, isError, message }
        = useSelector((state) => state.flock);

    useEffect(() => {
        if (!flocks || flocks.length === 0) {
            dispatch(getFlocks());
        }
    }, [dispatch, flocks]);

    const flockCount = flocks ? flocks.length : 0;

    let cardContent;

    if (isLoading) {
        cardContent = (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-sky-500"></div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Loading Flocks...</p>
            </div>
        );
    } else if (isError) {
        cardContent = (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <FaPaw className="w-8 h-8 text-red-400 mb-2" />
                <p className="font-semibold text-red-600">Error</p>
                <p className="text-xs text-red-500 px-2">{message || "Could not load animal data."}</p>
            </div>
        );
    } else {
        cardContent = (
            <>
                {/* Icon Area */}
                <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-sky-100 dark:bg-sky-500/20 mb-3 group-hover:bg-sky-200 dark:group-hover:bg-sky-500/30 transition-colors duration-200">
                    <FaPaw className="w-6 h-6 sm:w-7 sm:h-7 text-sky-600 dark:text-sky-400" />
                </div>

                {/* Data Area */}
                <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
                        {flockCount}
                    </div>
                    <h2 className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 mt-1">
                        Total Flocks
                    </h2>
                </div>
            </>
        );
    }


    return (
        <div className="group col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center justify-center p-5 h-48"> {/* Fixed height for consistency */}
                {cardContent}
            </div>
        </div>
    );
}

export default FlockCard;