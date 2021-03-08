import http from "../http-common";

class RolDataService {
  getAll() {
    return http.get("/rols");
  }

  get(id) {
    return http.get(`/rols/${id}`);
  }

  create(data) {
    return http.post("/auth/signin", data);
  }

  update(id, data) {
    return http.put(`/rols/${id}`, data);
  }

  delete(id) {
    return http.delete(`/rols/${id}`);
  }

  deleteAll() {
    return http.delete(`/rols`);
  }

}

export default new RolDataService();