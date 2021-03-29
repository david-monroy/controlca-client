import http from "../http-common";

class OfferDataService {
  getAll() {
    return http.get("/offers");
  }

  get(id) {
    return http.get(`/offers/${id}`);
  }

  getByLeader(id) {
    return http.get(`/offers/leader/${id}`);
  }

  create(data) {
    return http.post("/offers", data);
  }

  addUser(data) {
    return http.post("/offers/addUser", data);
  }

  updateUser(data) {
    return http.post("/offers/updateUser", data);
  }

  update(id, data) {
    return http.put(`/offers/${id}`, data);
  }

  delete(id) {
    return http.delete(`/offers/${id}`);
  }

  deleteAll() {
    return http.delete(`/offers`);
  }
}

export default new OfferDataService();