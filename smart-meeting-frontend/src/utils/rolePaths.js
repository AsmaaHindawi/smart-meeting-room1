export const getDashboardPath = (role) => {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'employee':
      return '/employee/dashboard';
    case 'user':
    default:
      return '/user/dashboard';
  }
};
