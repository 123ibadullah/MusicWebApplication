import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import AddSong from "./pages/AddSong";
import ListAlbum from "./pages/ListAlbum";
import ListSong from "./pages/ListSong";
import AddAlbum from "./pages/AddAlbum";
import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";

import TestUpload from "./components/TestUpload";
export const url = "http://localhost:4000";

const App = () => {
  return (
    <div className="flex items-start min-h-screen">
      <ToastContainer />
      <SideBar />
      <div className="flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]">
        <Navbar />
        <div className="pt-8 pl-5 sm:pt-12 sm:pl-12">
          <Routes>
            <Route path="/add-song" element={<AddSong />} />
            <Route path="/add-album" element={<AddAlbum />} />
            <Route path="/list-album" element={<ListAlbum />} />
            <Route path="/list-song" element={<ListSong />} />
            // Add this route to your Routes
            <Route path="/test-upload" element={<TestUpload />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
// Add this import
export default App;
