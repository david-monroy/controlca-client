import http from "../http-common";

class OfferUserDataService {
  getAll() {
    return http.get("/offer_users");
  }

  addLoad(data) {
    return http.post("/offer_users/addLoad", data);
  }

}

export default new OfferUserDataService();