import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "../components/layouts/Sidebar";

import Dashboard from "./Dashboard";
import AddUser from "./UserManagement/AddUser";
import ViewUsers from "./UserManagement/ViewUsers";
import UserProfile from "./UserManagement/UserProfile";
import EditUserProfile from "./UserManagement/EditUserProfile";
import MyProfile from "./UserManagement/MyProfile";
import EditMyProfile from "./UserManagement/EditMyProfile";
import ChangePassword from "./UserManagement/ChangePassword";

import UploadCSVFireIndex from "./FireIndexManagement/UploadCSVFireIndex";
import UploadCSVBaseRegion from "./BaseRegionManagement/UploadCSVBaseRegion";


const AdministrationPage = () => {
   
    return (
       <>

        <Box sx={{display:'flex'}}>
            
            <Sidebar />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3 ,marginTop:"55px"}}>

                <Routes>

                    <Route index element={<Dashboard />} />

                    <Route path="/users" element={<ViewUsers />} />

                    <Route path="/users/add" element={<AddUser />} />

                    <Route path="/users/:id" element={<UserProfile />} />

                    <Route path="/users/:id/edit" element={<EditUserProfile />} />

                    <Route path="/myprofile" element={<MyProfile />} />

                    <Route path="/myprofile/edit" element={<EditMyProfile />} />

                    <Route path="/myprofile/changepwd" element={<ChangePassword />} />

                    <Route path="/mgmt_baseregion/uploadcsv" element={<UploadCSVBaseRegion />} />

                    <Route path="/mgmt_fireindex/uploadcsv" element={<UploadCSVFireIndex />} />
                       
                </Routes>
            
            </Box>

        </Box>
       </>
    )
}

export default AdministrationPage;