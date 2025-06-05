import { debounce, throttle, isEmpty, isEqual } from 'lodash';
import { cloneDeep, merge, pick, omit } from 'lodash';
import _ from 'lodash';

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Debounced search function
export const debouncedSearch = debounce((query: string, callback: (query: string) => void) => {
  callback(query);
}, 300);

// Throttled scroll handler
export const throttledScrollHandler = throttle((callback: () => void) => {
  callback();
}, 100);

// Deep clone utility
export const deepClone = <T>(obj: T): T => {
  return cloneDeep(obj);
};

// Merge objects utility
export const mergeObjects = <T extends object>(target: T, ...sources: Partial<T>[]): T => {
  return merge({}, target, ...sources);
};

// Check if object is empty
export const isEmptyObject = (obj: any): boolean => {
  return isEmpty(obj);
};

// Compare objects for equality
export const areObjectsEqual = (obj1: any, obj2: any): boolean => {
  return isEqual(obj1, obj2);
};

// Pick specific properties from object
export const pickProperties = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  return pick(obj, keys);
};

// Omit specific properties from object
export const omitProperties = <T extends object, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> => {
  return omit(obj, keys);
};

// Format currency using lodash
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  if (_.isNaN(amount) || !_.isNumber(amount)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Capitalize first letter of each word
export const capitalizeWords = (str: string): string => {
  return _.startCase(_.toLower(str));
};

// Generate random ID
export const generateId = (): string => {
  return _.uniqueId(`id_${Date.now()}_`);
};

// Chunk array into smaller arrays
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  return _.chunk(array, size);
};

// Get nested property safely
export const getNestedProperty = (obj: any, path: string, defaultValue?: any): any => {
  return _.get(obj, path, defaultValue);
};

// Set nested property safely
export const setNestedProperty = (obj: any, path: string, value: any): any => {
  return _.set(obj, path, value);
};

// Flatten nested arrays
export const flattenArray = <T>(array: (T | T[])[]): T[] => {
  return _.flatten(array);
};

// Remove duplicates from array
export const removeDuplicates = <T>(array: T[]): T[] => {
  return _.uniq(array);
};

// Sort array by multiple criteria
export const sortBy = <T>(array: T[], iteratees: Array<string | ((item: T) => any)>): T[] => {
  return _.sortBy(array, iteratees);
};

// Group array by property
export const groupBy = <T>(array: T[], iteratee: string | ((item: T) => any)): Record<string, T[]> => {
  return _.groupBy(array, iteratee);
};

// Filter array with multiple conditions
export const filterByConditions = <T extends object>(
  array: T[], 
  conditions: Partial<T>
): T[] => {
  return _.filter(array, conditions);
};

// Transform object keys
export const transformKeys = <T extends object>(
  obj: T, 
  transformer: (key: string) => string
): Record<string, any> => {
  return _.mapKeys(obj, (value, key) => transformer(key));
};

// Convert to camelCase keys
export const toCamelCaseKeys = <T extends object>(obj: T): Record<string, any> => {
  return transformKeys(obj, _.camelCase);
};

// Convert to snake_case keys
export const toSnakeCaseKeys = <T extends object>(obj: T): Record<string, any> => {
  return transformKeys(obj, _.snakeCase);
};

// Retry function with exponential backoff
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + _.random(0, 1000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && !_.isEmpty(email.trim());
};

// Sanitize HTML string
export const sanitizeHtml = (html: string): string => {
  return _.escape(html);
};

// Parse query parameters
export const parseQueryParams = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

// Build query string from object
export const buildQueryString = (params: Record<string, any>): string => {
  const filtered = _.pickBy(params, (value) => !_.isNil(value) && value !== '');
  const searchParams = new URLSearchParams();
  
  _.forEach(filtered, (value, key) => {
    searchParams.append(key, String(value));
  });
  
  return searchParams.toString();
};