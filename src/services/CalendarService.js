import http from "../http-common";
const getAll = () => {
    return http.get("/calendar");
};
const get = id => {
    return http.get(`/calendar/${id}`);
};
const manage = (data, id) => {
    if(typeof id === "undefined"){
        return http.post("/calendar", data);
    }else{
        return http.post(`/calendar/${id}`, data);
    }
};
const remove = id => {
    return http.delete(`/calendar/${id}`);
};
const bulkAction = (data) => {
    return http.post(`/calendar/bulk`, data);
};
export default {
    getAll,
    get,
    manage,
    remove,
    bulkAction
};