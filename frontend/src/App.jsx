import React from "react";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import HomePage from "./Pages/HomePage";
import StorePage from "./Pages/StorePage";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./Pages/NotFoundPage";

const App = () => {
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
