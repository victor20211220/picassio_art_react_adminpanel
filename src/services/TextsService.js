import http from "../http-common";
const getAll = () => {
    return http.get("/texts");
};
const manage = (data) => {
    return http.post("/texts", data);
};

export default {
    getAll,
    manage,
};