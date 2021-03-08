import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/users");
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  getByEmail(email) {
    return http.get(`/users/email/${email}`);
  }

  create(data) {
    return http.post("/auth/signin", data);
  }

  update(id, data) {
    return http.put(`/users/${id}`, data);
  }

  delete(id) {
    return http.delete(`/users/${id}`);
  }

  deleteAll() {
    return http.delete(`/users`);
  }

  findByEmail(email) {
    return http.get(`/users?email=${email}`);
  }
}

export default new UserDataService();