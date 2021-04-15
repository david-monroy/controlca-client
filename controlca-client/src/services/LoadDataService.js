import http from "../http-common";

class LoadDataService {
  getAll() {
    return http.get("/loads");
  }

  get(id) {
    return http.get(`/loads/${id}`);
  }

  create(data) {
    return http.post("/loads", data);
  }

  update(id, data) {
    return http.put(`/loads/${id}`, data);
  }

  delete(id) {
    return http.delete(`/loads/${id}`);
  }

  deleteAll() {
    return http.delete(`/loads`);
  }

}

export default new LoadDataService();