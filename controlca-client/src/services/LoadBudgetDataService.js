import http from "../http-common";

class LoadBudgetDataService {
  getAll() {
    return http.get("/load_budgets");
  }

  get(id) {
    return http.get(`/load_budgets/${id}`);
  }

  create(data) {
    return http.post("/load_budgets", data);
  }

  update(id, data) {
    return http.put(`/load_budgets/${id}`, data);
  }

  delete(id) {
    return http.delete(`/load_budgets/${id}`);
  }

  deleteAll() {
    return http.delete(`/load_budgets`);
  }

}

export default new LoadBudgetDataService();