import http from "../http-common";

class BitacoraOfferDataService {
  getAll() {
    return http.get("/bitacora_offers");
  }

  get(id) {
    return http.get(`/bitacora_offers/${id}`);
  }

  create(data) {
    return http.post("/bitacora_offers", data);
  }

  update(id, data) {
    return http.put(`/bitacora_offers/${id}`, data);
  }

  delete(id) {
    return http.delete(`/bitacora_offers/${id}`);
  }

  deleteAll() {
    return http.delete(`/bitacora_offers`);
  }

}

export default new BitacoraOfferDataService();