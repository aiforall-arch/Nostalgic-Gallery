import React from 'react';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to gallery
      </button>
      <h2>Admin Dashboard</h2>
      <p>
        This is a placeholder admin dashboard. Once everything builds correctly,
        we can add controls to manage media items here.
      </p>
    </div>
  );
};

export default AdminDashboard;
