import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';
import { debounce, throttle, omit, pick } from 'lodash';
import classNames from 'classnames';

import App from './App';
import Dashboard from './components/Dashboard';
import UserCard from './components/UserCard';
import { 
  deepClone, 
  mergeObjects, 
  debouncedSearch,
  formatCurrency,
  generateId 
} from './utils/helpers';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
axios.defaults.timeout = 10000;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});

// Initialize error reporting
const reportError = (error: Error, errorInfo?: any) => {
  console.error('Application Error:', error, errorInfo);
  
  // In production, you might want to send this to an error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Sentry.captureException(error);
  }
};

// Global error handler
window.addEventListener('error', (event) => {
  reportError(new Error(event.message), {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

window.addEventListener('unhandledrejection', (event) => {
  reportError(new Error(event.reason), { type: 'unhandledrejection' });
});

// Utility functions using various libraries
const utils = {
  formatDate: (date: string | Date) => {
    try {
      const parsedDate = typeof date === 'string' ? parseISO(date) : date;
      return isValid(parsedDate) ? format(parsedDate, 'MMM dd, yyyy') : 'Invalid Date';
    } catch (error) {
      return 'Invalid Date';
    }
  },
  
  createClassNames: (...classes: (string | undefined | null | false)[]) => {
    return classNames(...classes);
  },
  
  createDebouncedCallback: <T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 300
  ) => {
    return debounce(callback, delay);
  },
  
  createThrottledCallback: <T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 100
  ) => {
    return throttle(callback, delay);
  },
  
  sanitizeUserInput: (input: string) => {
    return input.trim().replace(/[<>]/g, '');
  },
  
  extractUserData: (user: any) => {
    return pick(user, ['id', 'name', 'email', 'avatar', 'role']);
  },
  
  removeInternalFields: (data: any) => {
    return omit(data, ['_id', '__v', 'password', 'internalNotes']);
  }
};

// API service setup
const apiService = {
  client: axios,
  
  get: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await axios.get(url, config);
    return response.data;
  },
  
  post: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axios.post(url, data, config);
    return response.data;
  },
  
  put: async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axios.put(url, data, config);
    return response.data;
  },
  
  delete: async <T = any>(url: string, config?: any): Promise<T> => {
    const response = await axios.delete(url, config);
    return response.data;
  }
};

// Application initialization
const initializeApp = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(container);
  
  root.render(
    <React.StrictMode>
      <Provider store={undefined as any}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
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
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
};

// Start the application
try {
  initializeApp();
  console.log('Application initialized successfully');
} catch (error) {
  console.error('Failed to initialize application:', error);
  reportError(error as Error, { context: 'initialization' });
}

// Export utilities for other modules
export {
  utils,
  apiService,
  queryClient,
  reportError
};

export default App;