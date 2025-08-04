import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AuthorityLogin from './pages/AuthorityLogin';
import AuthoritySignup from './pages/AuthoritySignup';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FileComplaint from './pages/FileComplaint';
import ComplaintStatus from './pages/ComplaintStatus';
import ManageComplaints from './pages/ManageComplaints';
import ViewComplaints from './pages/ViewComplaints';
import Feedback from './pages/Feedback';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Team from './pages/team';
import Notifications from './pages/Notifications';
import StudentNotifications from './pages/StudentNotifications';


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/authority-login" element={<AuthorityLogin />} />
          <Route path="/authority-signup" element={<AuthoritySignup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/team" element={<Team />} />

          {/* Student Routes */}
          <Route path="/student-dashboard" element={
            <PrivateRoute roles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/file-complaint" element={
            <PrivateRoute roles={['student']}>
              <FileComplaint />
            </PrivateRoute>
          } />
          <Route path="/complaint-status" element={
            <PrivateRoute roles={['student']}>
              <ComplaintStatus />
            </PrivateRoute>
          } />
          <Route path="/feedback" element={
            <PrivateRoute roles={['student']}>
              <Feedback />
            </PrivateRoute>
          } />

          {/* Authority Routes */}
          <Route path="/authority-dashboard" element={
            <PrivateRoute roles={['authority']}>
              <AuthorityDashboard />
            </PrivateRoute>
          } />
          <Route path="/manage-complaints" element={
            <PrivateRoute roles={['authority']}>
              <ManageComplaints />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/view-complaints" element={
            <PrivateRoute roles={['admin']}>
              <ViewComplaints />
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute roles={['admin', 'authority']}>
              <Notifications />
            </PrivateRoute>
          } />
          {/* <Route path="/student-notifications" element={
            <PrivateRoute roles={['student']}>
              <StudentNotifications />
            </PrivateRoute>
          } /> */}
          <Route path="/student-notifications" element={<StudentNotifications />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
