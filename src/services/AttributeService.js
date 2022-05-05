import http from "../http-common";
const getAll = () => {
    return http.get("/attributes");
};
const get = id => {
    return http.get(`/attributes/${id}`);
};
const manage = (data, id) => {
    if(typeof id === "undefined"){
        return http.post("/attributes", data);
    }else{
        return http.post(`/attributes/${id}`, data);
    }
};
const remove = id => {
    return http.delete(`/attributes/${id}`);
};

export default {
    getAll,
    get,
    manage,
    remove,
};