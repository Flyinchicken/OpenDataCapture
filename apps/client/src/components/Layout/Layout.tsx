import React from 'react';

import { Outlet } from 'react-router-dom';

import { Footer } from '../Footer';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex h-screen w-screen flex-col md:flex-row">
      <div className="print:hidden md:hidden">
        <Navbar />
      </div>
      <div className="hidden print:hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      <div className="scrollbar-hidden flex flex-grow flex-col overflow-y-scroll">
        <main className="container flex-grow">
          <Outlet />
        </main>
        <hr className="mb-2 mt-4 print:hidden" />
        <Footer />
      </div>
    </div>
  );
};
