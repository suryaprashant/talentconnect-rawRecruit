// src/components/common/savedJob/JobRoutes.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import JobList from "./JobList";
import JobDetailRouter from "./JobDetailRouter";
import JobLayout from "./JobLayout";

const JobRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <JobLayout>
          <JobList />
        </JobLayout>
      }
    />
    
    {/* Use the router component to decide which detail page to show */}
    <Route
      path="/job/:id"
      element={
        <JobLayout>
          <JobDetailRouter />
        </JobLayout>
      }
    />
  </Routes>
);

export default JobRoutes;