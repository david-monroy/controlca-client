import http from "../http-common";

class BudgetDataService {
  getAll() {
    return http.get("/budgets");
  }

  get(id) {
    return http.get(`/budgets/${id}`);
  }

  create(data) {
    return http.post("/budgets", data);
  }

  load(data) {
    return http.post("/budgets/load", data);
  }

  update(id, data) {
    return http.put(`/budgets/${id}`, data);
  }

  delete(id) {
    return http.delete(`/budgets/${id}`);
  }

  deleteAll() {
    return http.delete(`/budgets`);
  }

}

export default new BudgetDataService();