import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

interface User {
  id: number;
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Simulated API call
      const response = await fetch('/api/users');
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management App</h1>
        <p>Click count: {count}</p>
        <button onClick={handleIncrement}>Increment</button>
      </header>
      
      <main className="user-list">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="user-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </main>
    </div>
  );
};

export default App;