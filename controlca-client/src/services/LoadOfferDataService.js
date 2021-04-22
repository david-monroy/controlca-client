import http from "../http-common";

class LoadOfferDataService {
  getAll() {
    return http.get("/load_offers");
  }

  get(id) {
    return http.get(`/load_offers/${id}`);
  }

  create(data) {
    return http.post("/load_offers", data);
  }

  update(id, data) {
    return http.put(`/load_offers/${id}`, data);
  }

  delete(id) {
    return http.delete(`/load_offers/${id}`);
  }

  deleteAll() {
    return http.delete(`/load_offers`);
  }

}

export default new LoadOfferDataService();