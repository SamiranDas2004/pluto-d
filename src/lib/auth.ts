export const getToken = () => {
  // Token is now in httpOnly cookie, not accessible from JS
  return null;
};

export const setToken = (token: string) => {
  // Token is now in httpOnly cookie, no need to store
};

export const removeToken = () => {
  // Token is now in httpOnly cookie, cleared by server
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authUser');
  }
};

export const isAuthenticated = () => {
  // Check if user data exists (token is in httpOnly cookie)
  return !!getUser();
};
