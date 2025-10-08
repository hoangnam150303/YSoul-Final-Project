import userApi from "../hooks/userApi";
import authApi from "../hooks/authApi";
const GET_USER = "GET_USER";
const LOGOUT_USER = "LOGOUT_USER";
const getUserRequest = () => {
  return async (dispatch) => {
    try {
      const response = await userApi.getUser();
      const user = response.data;
      dispatch(getUser(user));
    } catch (error) {
      throw error;
    }
  };
};

const logoutUser = async () => {
  try {
    await localStorage.clear();
    await authApi.logout();
    getUserRequest();

    window.location.href = "/login";
  } catch (error) {
    throw error;
  }
};

const getUser = (user) => {
  return {
    type: GET_USER,
    payload: user,
  };
};

const initialState = {
  is_admin: false,
  name: "",
  id: null,
  vip: false,
  avatar: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER: {
      return { ...action.payload };
    }
    case LOGOUT_USER: {
      return { ...initialState }; // Reset lại trạng thái người dùng
    }
    default:
      return { ...state };
  }
};

export { getUserRequest, getUser, GET_USER, logoutUser };

export default userReducer;
