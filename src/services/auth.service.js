import axios from "axios";
export const authClient = axios.create({
  baseURL: process.env.REACT_APP_APIURL,
  withCredentials: true,
  headers: { Accept: 'application/json' }
})


const register = async (name, email, password, password_confirmation) => {
  const tokenResult = await withTokenRequest();
  if (typeof tokenResult === "string") {
    return tokenResult;
  }
  return authClient.post("/register", {
    name,
    email,
    password,
    password_confirmation
  }).then(function (response) {
    console.log(response);
    return response;
  }).catch(function (error) {
    console.log(error);
    return error.response;
  });
};

const login = async (email, password, admin) => {
  const tokenResult = await withTokenRequest();
  if (typeof tokenResult === "string") {
    return tokenResult;
  }
  return authClient.post(admin == "1" ? "/admin-login" : "/login", {
    email,
    password,
  }).then(function (response) {
    console.log(response);
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response;
  }).catch(function (error) {
    console.log(error);
    return error.response;
  });
};


const logout = async () => {
  localStorage.removeItem("user");
  const tokenResult = await withTokenRequest();
  if (typeof tokenResult === "string") {
    return tokenResult;
  }
  return authClient.post("/logout").then((response) => {
    return response.data;
  });
};


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

function withTokenRequest() {
  return new Promise(resolve => authClient(`/sanctum/csrf-cookie`)
    .then(response => {
      resolve(response);
    }).catch(function (error) {
      resolve(error.message);
    })
  )
}

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default AuthService;
