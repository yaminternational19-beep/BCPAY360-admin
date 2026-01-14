import React from "react";
import { Routes, Route } from "react-router-dom";
import PayrollList from "./components/PayrollList";
import PayrollConfirm from "./components/PayrollConfirm";
import PayrollFilters from "./components/PayrollFilters";

const PayrollManagement = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <PayrollFilters />
            <PayrollList />
          </div>
        }
      />
      <Route path="/confirm" element={<PayrollConfirm />} />
    </Routes>
  );
};

export default PayrollManagement;