import http from "../http-common";
const getAll = () => {
    return http.get("/calendar");
};
const get = id => {
    return http.get(`/calendar/${id}`);
};
const create = data => {
    return http.post("/calendar", data);
};
const update = (id, data) => {
    return http.post(`/calendar/${id}`, data);
};
const remove = id => {
    return http.delete(`/calendar/${id}`);
};
const removeAll = () => {
    return http.delete(`/calendar`);
};
const findByTitle = title => {
    return http.get(`/calendar?title=${title}`);
};
const bulkAction = (data) => {
    return http.post(`/calendar/bulk`, data);
};
export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle,
    bulkAction
};