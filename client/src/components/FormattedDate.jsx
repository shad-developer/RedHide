import React from 'react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0'); 
  const month = date.toLocaleString('en-US', { month: 'short' }); 
  const year = date.getFullYear(); 
  
  
  return `${day}-${month}-${year}`;
};

const FormattedDate = ({ date }) => {
  return <span>{formatDate(date)}</span>;
};

export default FormattedDate;
