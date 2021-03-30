import http from "../http-common";

class ProjectUserDataService {
  getAll() {
    return http.get("/project_users");
  }

  addLoad(data) {
    return http.post("/project_users/addLoad", data);
  }

}

export default new ProjectUserDataService();