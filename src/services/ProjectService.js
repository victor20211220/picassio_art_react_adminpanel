import http from "../http-common";
const getAll = () => {
    return http.get("/projects");
};
const get = id => {
    return http.get(`/projects/${id}`);
};
const create = data => {
    return http.post("/projects", data);
};
const update = (id, data) => {
    return http.post(`/projects/${id}`, data);
};
const remove = id => {
    return http.delete(`/projects/${id}`);
};
const removeAll = () => {
    return http.delete(`/projects`);
};
const findByTitle = title => {
    return http.get(`/projects?title=${title}`);
};
export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle
};