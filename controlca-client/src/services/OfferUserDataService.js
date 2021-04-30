import http from "../http-common";

class OfferUserDataService {
  getAll() {
    return http.get("/offer_users");
  }

  addLoad(data) {
    return http.post("/offer_users/addLoad", data);
  }
  
  addBitacora(data) {
    return http.post("/offer_users/addBitacora", data);
  }

  update(id, data) {
    return http.put(`/offer_users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/offer_users/${id}`);
  }

}

export default new OfferUserDataService();