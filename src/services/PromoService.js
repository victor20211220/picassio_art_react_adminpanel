import http from "../http-common";
const getAll = () => {
    return http.get("/promos");
};
const get = id => {
    return http.get(`/promos/${id}`);
};
const manage = (data, id) => {
    if(typeof id === "undefined"){
        return http.post("/promos", data);    
    }else{
        return http.post(`/promos/${id}`, data);
    }
};
const remove = id => {
    return http.delete(`/promos/${id}`);
};
const bulkAction = (data) => {
    return http.post(`/promos/bulk`, data);
};
export default {
    getAll,
    get,
    manage,
    remove,
    bulkAction
};