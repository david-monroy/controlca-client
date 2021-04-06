import http from "../http-common";

class LoadAdminDataService {
  getAll() {
    return http.get("/load_admins");
  }

  get(id) {
    return http.get(`/load_admins/${id}`);
  }

  create(data) {
    return http.post("/load_admins", data);
  }

  update(id, data) {
    return http.put(`/load_admins/${id}`, data);
  }

  delete(id) {
    return http.delete(`/load_admins/${id}`);
  }

  deleteAll() {
    return http.delete(`/load_admins`);
  }

}

export default new LoadAdminDataService();