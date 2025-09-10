// Environment configuration for development and production
export const config = {
  // App URLs
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5176',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Supabase
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // Payment URLs
  PAYMENT_SUCCESS_URL: `${import.meta.env.VITE_APP_URL || 'http://localhost:5176'}/payment/success`,
  PAYMENT_CANCEL_URL: `${import.meta.env.VITE_APP_URL || 'http://localhost:5176'}/ai-card-generator`,
  
  // Environment
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Helper function to get the correct URL based on environment
export const getAppUrl = () => {
  if (config.IS_PRODUCTION) {
    // In production, use the actual domain
    return config.APP_URL;
  }
  // In development, use localhost
  return 'http://localhost:5176';
};

// Helper function to get the correct API URL
export const getApiUrl = () => {
  if (config.IS_PRODUCTION) {
    // In production, use the production API URL
    return config.API_URL;
  }
  // In development, use localhost
  return 'http://localhost:5000';
};

// Helper function to get payment success URL
export const getPaymentSuccessUrl = () => {
  const baseUrl = getAppUrl();
  return `${baseUrl}/payment/success`;
};

// Helper function to get payment cancel URL
export const getPaymentCancelUrl = () => {
  const baseUrl = getAppUrl();
  return `${baseUrl}/ai-card-generator`;
};
