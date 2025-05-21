// src/utils/logout.js
export const handleLogout = (dispatch, navigate, logoutAction) => {
    if (logoutAction && dispatch) dispatch(logoutAction());
    localStorage.clear();
    navigate("/auth");
  };
  