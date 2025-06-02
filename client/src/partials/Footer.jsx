import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white text-black p-4 text-center">
      © {currentYear} <b>RedHide Ranch</b> - All rights reserved | Shad Developers
    </footer>
  );
};

export default Footer;
