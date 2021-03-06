import http from "../http-common";
const getAll = () => {
    return http.get("/blockchains");
};
const get = id => {
    return http.get(`/blockchains/${id}`);
};
const manage = (data, id) => {
    if(typeof id === "undefined"){
        return http.post("/blockchains", data);
    }else{
        return http.post(`/blockchains/${id}`, data);
    }
};
const remove = id => {
    return http.delete(`/blockchains/${id}`);
};

export default {
    getAll,
    get,
    manage,
    remove,
};