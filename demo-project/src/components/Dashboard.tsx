import React, { useState, useEffect, useMemo, useContext } from 'react';
import { createContext } from 'react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingTasks: number;
  completedTasks: number;
}

interface DashboardContextType {
  stats: DashboardStats;
  refreshStats: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshStats = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const mockStats = {
        totalUsers: Math.floor(Math.random() * 1000) + 100,
        activeUsers: Math.floor(Math.random() * 500) + 50,
        pendingTasks: Math.floor(Math.random() * 25) + 5,
        completedTasks: Math.floor(Math.random() * 100) + 20
      };
      
      setStats(mockStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const completionRate = useMemo(() => {
    const total = stats.pendingTasks + stats.completedTasks;
    return total > 0 ? (stats.completedTasks / total * 100).toFixed(1) : 0;
  }, [stats.pendingTasks, stats.completedTasks]);

  const activeUserPercentage = useMemo(() => {
    return stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers * 100).toFixed(1) : 0;
  }, [stats.totalUsers, stats.activeUsers]);

  const contextValue = useMemo(() => ({
    stats,
    refreshStats
  }), [stats]);

  if (loading && !lastUpdated) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="dashboard-meta">
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button 
              onClick={refreshStats} 
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>Total Users</h2>
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
          </div>
          
          <div className="stat-card">
            <h2>Active Users</h2>
            <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
            <div className="stat-subtitle">{activeUserPercentage}% of total</div>
          </div>
          
          <div className="stat-card">
            <h2>Pending Tasks</h2>
            <div className="stat-value">{stats.pendingTasks}</div>
          </div>
          
          <div className="stat-card">
            <h2>Completed Tasks</h2>
            <div className="stat-value">{stats.completedTasks}</div>
            <div className="stat-subtitle">{completionRate}% completion rate</div>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default Dashboard;
export { DashboardContext };