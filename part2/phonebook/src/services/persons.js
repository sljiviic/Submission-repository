import axios from "axios";

const baseUrl = '/api/persons';

const getAll = () => (
    axios.get(baseUrl)
        .then(response => response.data)
);

const create = newObj => (
    axios.post(baseUrl, newObj)
        .then(response => response.data)
);

const remove = id => axios.delete(`${baseUrl}/${id}`);

const update = (id, newObj) => (
    axios.put(`${baseUrl}/${id}`, newObj)
        .then(response => response.data)
);

export default {getAll, create, remove, update};