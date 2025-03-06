export const wrapResponse = (success, data, message = '') => {
  return {
    success,
    data,
    message
  };
}; 