import React from 'react';
import BrandImage from "../../images/brand.jpeg"; // Renamed for clarity
import { FaPhone, FaUser } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";

// You might want to pass these as props in a real application
const BRAND_DETAILS = {
  name: "RedHide Ranch", // Added a name for the brand
  owner: "Asad Mehmood",
  contact: "03407911992",
  location: "Soda Basti, Chishtian",
  tagline: "Quality Livestock & Farm Produce" // Added a tagline
};

function DashboardBrandingCard() {
  return (
    <div className="col-span-full lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 flex-shrink-0 flex items-center justify-center p-4 md:p-0 bg-slate-50 dark:bg-slate-700/50 md:bg-transparent md:dark:bg-transparent">
          <img
            src={BrandImage}
            alt={`${BRAND_DETAILS.name} Logo`}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full md:rounded-lg object-cover shadow-lg border-4 border-white dark:border-slate-600"
          />
        </div>

        {/* Details Section */}
        <div className="flex-grow p-5 md:p-6 space-y-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
              {BRAND_DETAILS.name}
            </h2>
            {BRAND_DETAILS.tagline && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {BRAND_DETAILS.tagline}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <InfoItem icon={<FaUser />} label="Owner" value={BRAND_DETAILS.owner} />
            <InfoItem icon={<FaPhone />} label="Contact" value={BRAND_DETAILS.contact} href={`tel:${BRAND_DETAILS.contact}`} />
            <InfoItem icon={<FaLocationDot />} label="Location" value={BRAND_DETAILS.location} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent info item display
const InfoItem = ({ icon, label, value, href }) => (
  <div className="flex items-start text-sm sm:text-base">
    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-sky-600 dark:text-sky-500 mr-3">
      {React.cloneElement(icon, { size: 18 })}
    </span>
    <div className="text-slate-700 dark:text-slate-300">
      <span className="font-semibold">{label}:</span>{' '}
      {href ? (
        <a href={href} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 underline-offset-2 hover:underline">
          {value}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  </div>
);

export default DashboardBrandingCard;