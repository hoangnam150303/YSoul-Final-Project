import userApi from "../hooks/userApi";

const GET_USER = "GET_USER";
const LOGOUT_USER = "LOGOUT_USER";
const getUserRequest = () => {
  return async (dispatch) => {
    try {
      const response = await userApi.getUser();
      const user = response.data;      
      console.log(user);
      
      dispatch(getUser(user));
    } catch (error) {
      throw error;
    }
  };
};

const logoutUser = () => {
  // Xóa thông tin người dùng trong localStorage
  localStorage.clear();
  return {
    type: LOGOUT_USER,
  };
};

const getUser = (user) => {
  return {
    type: GET_USER,
    payload: user,
  };
};

const initialState = { is_admin: false, name: "", id: 0, vip: false,avatar:"" };

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
