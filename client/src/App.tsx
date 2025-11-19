import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import ToolsPage from './pages/ToolsPage';
import PlannerPage from './pages/PlannerPage';
import ChatPage from './pages/ChatPage';
import BottomNav from './components/BottomNav';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}
