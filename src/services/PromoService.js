import http from "../http-common";
const getAll = () => {
    return http.get("/promos");
};
const get = id => {
    return http.get(`/promos/${id}`);
};
const create = data => {
    return http.post("/promos", data);
};
const update = (id, data) => {
    return http.post(`/promos/${id}`, data);
};
const remove = id => {
    return http.delete(`/promos/${id}`);
};
const removeAll = () => {
    return http.delete(`/promos`);
};
const findByTitle = title => {
    return http.get(`/promos?title=${title}`);
};
const bulkAction = (data) => {
    return http.post(`/promos/bulk`, data);
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