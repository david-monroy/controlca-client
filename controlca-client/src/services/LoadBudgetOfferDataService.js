import http from "../http-common";

class LoadBudgetOfferDataService {
  getAll() {
    return http.get("/load_budget_offers");
  }

  get(id) {
    return http.get(`/load_budget_offers/${id}`);
  }

  create(data) {
    return http.post("/load_budget_offers", data);
  }

  update(id, data) {
    return http.put(`/load_budget_offers/${id}`, data);
  }

  delete(id) {
    return http.delete(`/load_budget_offers/${id}`);
  }

  deleteAll() {
    return http.delete(`/load_budget_offers`);
  }

}

export default new LoadBudgetOfferDataService();