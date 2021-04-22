import http from "../http-common";

class ProjectUserDataService {
  getAll() {
    return http.get("/project_users");
  }

  addLoad(data) {
    return http.post("/project_users/addLoad", data);
  }

  addBitacora(data) {
    return http.post("/project_users/addBitacora", data);
  }

  update(id, data) {
    return http.put(`/project_users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/project_users/${id}`);
  }

}

export default new ProjectUserDataService();