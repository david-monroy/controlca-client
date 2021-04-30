import http from "../http-common";

class BudgetOfferDataService {
  getAll() {
    return http.get("/budget_offers");
  }

  get(id) {
    return http.get(`/budget_offers/${id}`);
  }

  create(data) {
    return http.post("/budget_offers", data);
  }

  load(data) {
    return http.post("/budget_offers/load", data);
  }

  update(id, data) {
    return http.put(`/budget_offers/${id}`, data);
  }

  delete(id) {
    return http.delete(`/budget_offers/${id}`);
  }

  deleteAll() {
    return http.delete(`/budget_offers`);
  }

}

export default new BudgetOfferDataService();