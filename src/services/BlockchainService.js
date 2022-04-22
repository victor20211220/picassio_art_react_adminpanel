import http from "../http-common";
const getAll = () => {
    return http.get("/blockchains");
};
const get = id => {
    return http.get(`/blockchains/${id}`);
};
const create = data => {
    return http.post("/blockchains", data);
};
const update = (id, data) => {
    return http.post(`/blockchains/${id}`, data);
};
const remove = id => {
    return http.delete(`/blockchains/${id}`);
};
const removeAll = () => {
    return http.delete(`/blockchains`);
};
const findByTitle = title => {
    return http.get(`/blockchains?title=${title}`);
};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle,
};