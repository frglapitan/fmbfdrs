import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingCircle from "./components/LoadingCircle";

const PublicPage = lazy(() => import("./pages/PublicPage"));
const AdministrationPage = lazy(() => import("./pages/AdministrationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NoPage = lazy(() => import("./pages/NoPage"));


function App () {

  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    setIsUserSignedIn(!!localStorage.getItem('accessToken'));
  }, []);



  return (
    
      <BrowserRouter>

        <Suspense fallback={<LoadingCircle />} >

          <Routes>

            <Route path="/*" element={<PublicPage />} />
       
            <Route path="/login" element={<LoginPage setIsUserSignedIn={setIsUserSignedIn} />} />

            <Route path="/forgot-password" element={<ForgotPassword /> } />

            <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

            {
              isUserSignedIn && <Route path="/administration/*" element={<AdministrationPage />} />
            }

            <Route path="*" element={<NoPage />} />

          </Routes>

        </Suspense>

      </BrowserRouter>
   
  )
}

export default App;