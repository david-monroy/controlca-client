import http from "../http-common";

class AreaDataService {
  getAll() {
    return http.get("/areas");
  }

  get(id) {
    return http.get(`/areas/${id}`);
  }

  create(data) {
    return http.post("/areas", data);
  }

  addProduct(data) {
    return http.post("/areas/addProduct", data);
  }

  updateProduct(data) {
    return http.post("/areas/updateProduct", data);
  }

  update(id, data) {
    return http.put(`/areas/${id}`, data);
  }

  delete(id) {
    return http.delete(`/areas/${id}`);
  }

  deleteAll() {
    return http.delete(`/areas`);
  }

}

export default new AreaDataService();