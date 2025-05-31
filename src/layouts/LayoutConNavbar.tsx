// src/layouts/LayoutConNavbar.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';

const LayoutConNavbar: React.FC = () => {
  return (
    <>
      <Navbar username="" />
      <Outlet />
    </>
  );
};

export default LayoutConNavbar;
