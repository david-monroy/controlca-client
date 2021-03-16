import http from "../http-common";

class ProjectDataService {
  getAll() {
    return http.get("/projects");
  }

  get(id) {
    return http.get(`/projects/${id}`);
  }

  getByLeader(id) {
    return http.get(`/projects/leader/${id}`);
  }

  create(data) {
    return http.post("/projects", data);
  }

  addProduct(data) {
    return http.post("/projects/addProduct", data);
  }

  updateProduct(data) {
    return http.post("/projects/updateProduct", data);
  }

  addUser(data) {
    return http.post("/projects/addUser", data);
  }

  updateUser(data) {
    return http.post("/projects/updateUser", data);
  }

  update(id, data) {
    return http.put(`/projects/${id}`, data);
  }

  delete(id) {
    return http.delete(`/projects/${id}`);
  }

  deleteAll() {
    return http.delete(`/projects`);
  }

  findByName(name) {
    return http.get(`/projects?name=${name}`);
  }
}

export default new ProjectDataService();