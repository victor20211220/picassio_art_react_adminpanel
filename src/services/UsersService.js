import http from "../http-common";
const getAll = () => {
    return http.get("/users");
};
const get = id => {
    return http.get(`/users/${id}`);
};
const manage = (data, id) => {
    if(typeof id === "undefined"){
        return http.post("/users", data);
    }else{
        return http.post(`/users/${id}`, data);
    }
};
const remove = id => {
    return http.delete(`/users/${id}`);
};
const removeAll = () => {
    return http.delete(`/users`);
};
const findByTitle = title => {
    return http.get(`/users?title=${title}`);
};
export default {
    getAll,
    get,
    manage,
    remove,
    removeAll,
    findByTitle
};