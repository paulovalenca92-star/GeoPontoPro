
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile, PointRecord } from './types';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HistoryPage from './pages/HistoryPage';
import DocumentationPage from './pages/DocumentationPage';
import CompanySettings from './pages/CompanySettings';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<PointRecord[]>([]);

  useEffect(() => {
    // Carregar Usuário
    const savedUser = localStorage.getItem('geoponto_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Carregar Registros
    const savedRecords = localStorage.getItem('geoponto_records');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('geoponto_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('geoponto_user');
  };

  const addRecord = (record: PointRecord) => {
    const newRecords = [record, ...records];
    setRecords(newRecords);
    localStorage.setItem('geoponto_records', JSON.stringify(newRecords));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route index element={
            user?.role === 'admin' 
              ? <AdminDashboard user={user} records={records} /> 
              : <EmployeeDashboard user={user} onRecordComplete={addRecord} lastRecords={records.filter(r => r.userId === user.uid)} />
          } />
          <Route path="history" element={<HistoryPage user={user} records={records.filter(r => r.userId === user.uid)} />} />
          <Route path="settings" element={user?.role === 'admin' ? <CompanySettings /> : <Navigate to="/" />} />
          <Route path="docs" element={<DocumentationPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
