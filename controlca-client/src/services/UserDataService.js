import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/users");
  }

  getAllByRol(rol) {
    return http.get(`/users/rol/${rol}`);
  }

  get(id) {
    return http.get(`/users/${id}`);
  }

  getByUsername(username) {
    return http.get(`/users/username/${username}`);
  }

  create(data) {
    return http.post("/auth/signup", data);
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

  findByUsername(username) {
    return http.get(`/users?username=${username}`);
  }
}

export default new UserDataService();