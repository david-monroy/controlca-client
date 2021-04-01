<template>
  <div class="col-md-12 mt-3 pt-1">
    <v-stepper v-model="formStep" class="mt-0 form-card stepper-project mx-auto">
    <v-stepper-header>
      <v-stepper-step
        :complete="formStep > 1"
        step="1"
      >
        Datos generales
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="formStep > 2"
        step="2"
      >
        Productos
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step
        :complete="formStep > 3"
        step="3">
        Involucrados
      </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="4">
        Confirmar
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-row class="pb-0 mb-0 pt-2 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.name"
                        
                        label="Nombre"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <input type="hidden" value="currentUser.id">
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.code"
                        label="Código"
                        name="code"
                        v-mask="'####'"
                        type="number"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.areas"
                        name="areas"
                        label="Número de áreas de trabajo"
                        placeholder="0"
                        type="number"
                        required
                    ></v-text-field>
                </div>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-0 form-row" >
            <v-col md="12" cols="12" class="py-0">
                <div class="form-group">
                    <v-textarea
                        v-model="projectData.description"
                        filled height="100"
                        label="Descripción (opcional)"
                        required
                    ></v-textarea>
                </div>
            </v-col>
          </v-row>

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn
                color="primary"
                @click="validateStep1()"
                >
                Siguiente
                </v-btn>
        </div>
        
      </v-stepper-content>

      <v-stepper-content step="2">
        <div v-if="projectData.products.length>0">
            <v-simple-table max-height="240px" >
                <template v-slot:default>
                    <thead >
                            <tr>
                            <th class="text-center">
                                Área
                            </th>
                            <th class="text-center">
                                Código
                            </th>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Horas estimadas
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(product,p) in projectData.products"
                        :key="p"
                        >
                        <td class="text-center">{{ product.area }}</td>
                        <td class="text-center">{{ product.code }}</td>
                        <td class="text-center">{{ product.name }}</td>
                        <td class="text-center">{{ product.estimated_hours }}</td>
                        <td class="text-center">
                            <v-icon small class="text-center" 
                            color="red" @click="removeProduct(p)">mdi-delete</v-icon>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
        </div>
        <div v-else class="no-items-label mx-5 mb-3 pa-5">
            <p class="text-body-2 ma-0">Ningún producto añadido, agrega uno usando el siguiente panel: </p>
        </div>
        <v-expansion-panels focusable class="px-5 mt-2 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir producto</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
            <v-row class="pa-0 ma-0 form-row-rol">
                <v-col md="6" cols="12" class="py-0">
                <v-select
                    v-model="temp_product_area"
                    :items="areas_list"
                    label="Área"
                    dense
                    required
                ></v-select>
              </v-col>
              <v-col md="6" cols="12" class="py-0">
                <v-select
                    v-model="temp_product_id"
                    :items="origin_products_rename"
                    label="Producto"
                    item-text="completeName"
                    item-value="id"
                    dense
                    required
                ></v-select>
              </v-col>
            </v-row>
            <v-row class="pa-0 ma-0 form-row-rol">
              <v-col md="6" cols="12" class="py-0 mx-auto">
                <v-text-field
                    v-model="temp_product_estimated_hours"
                    label="Horas estimadas"
                    suffix="horas"
                    type="number"
                ></v-text-field>
              </v-col>
              <v-col md="6" cols="12" class="py-0 mx-auto">
                <v-text-field
                    v-model="temp_product_obs"
                    label="Observaciones (opcional)"
                    type="text"
                ></v-text-field>
              </v-col>
        </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="addProductToProject()">
          Añadir al proyecto
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
           
        <div style="display: flex; justify-content: space-between" class="px-4">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn text color="primary"
            @click="formStep = 1">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="validateStep2()"
                >
                Siguiente
                </v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-content step="3">
        <div v-if="projectData.workers.length>0">
            <v-simple-table max-height="240px" >
                <template v-slot:default>
                    <thead >
                            <tr>

                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Apellido
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="(worker,w) in projectData.workers"
                        :key="w"
                        >
                        <td class="text-center">{{ worker.name }}</td>
                        <td class="text-center">{{ worker.lastname }}</td>
                        <td class="text-center">{{ worker.roster }}</td>
                        <td v-if="w>0" class="text-center">
                            <v-icon small class="text-center" 
                            color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                        </td>
                        <td v-else class="text-center">
                            <v-icon small class="text-center" disabled
                            color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
        </div>
        <div v-else class="no-items-label mx-5 mb-3 pa-5">
            <p class="text-body-2 ma-0">Ningún involucrado añadido, agrega uno usando el siguiente panel: </p>
        </div>
        <v-expansion-panels focusable class="px-5 mt-2 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir involucrado</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
            <v-row class="pa-0 ma-0 form-row-rol">
              <v-col md="6" cols="12" class="py-0">
                <v-select
                    v-model="temp_worker_roster"
                    :items="roster_list"
                    label="Rol"
                    dense
                    required
                ></v-select>
              </v-col>
              <v-col md="6" cols="12" class="py-0"
              v-if="temp_worker_roster == 'Director' || temp_worker_roster == 'Gerente'">
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_admin"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                </v-col>
              <!-- <v-col md="6" cols="12" class="py-0"
              v-else-if="temp_worker_roster == 'Líder'">
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_projects"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                </v-col> -->
              <v-col md="6" cols="12" class="py-0"
              v-else>
                    <v-select
                        v-model="temp_worker_id"
                        :items="origin_workers_hours"
                        label="Involucrado"
                        item-text="completeName"
                        item-value="id"
                        dense
                        required
                    ></v-select>
                
              </v-col>
            </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block w-75" @click="addWorkerToProject()">
          Añadir al proyecto
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn text color="primary"
            @click="formStep = 2">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="validateStep3()"
                >
                Siguiente
                </v-btn>
        </div>
      </v-stepper-content>
      <v-stepper-content step="4">

        <div class="no-items-label mb-3 pa-5">
            <p class="text-body-2 ma-0">Confirme la información. Recuerde que una vez registrado el proyecto, no podrá modificar los productos ni involucrados añadidos.</p>
        </div>
        <div class="project-confirm-section pa-4 body-2 mb-4">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <strong>Código: </strong> <p>{{projectData.code}}</p>
                </div>
                <div>
                    <strong>Áreas: </strong> <p>{{projectData.areas}}</p>
                </div>
                <div>
                    <strong>Líder: </strong> <p>{{currentUser.name}} {{currentUser.lastname}}</p>
                </div>
            </div>
            
            <div class="mb-2 pb-0 body-2" v-if="projectData.description">
                <p><strong>Descripción: </strong>{{projectData.description}}</p> 
            </div>
        </div>

        <v-expansion-panels focusable class="pa-0 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Productos ({{projectData.products.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table max-height="240px" >
                        <template v-slot:default>
                        <thead >
                            <tr>
                            <th class="text-center">
                                Área
                            </th>
                            <th class="text-center">
                                Código
                            </th>
                            <th class="text-center">
                                Producto
                            </th>
                            <th class="text-center">
                                Horas estimadas
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(product,p) in projectData.products"
                            :key="p"
                            >
                            <td class="text-center">{{ product.area }}</td>
                            <td class="text-center">{{ product.code }}</td>
                            <td class="text-center">{{ product.name }}</td>
                            <td class="text-center">{{ product.estimated_hours }}</td>
                            <td class="text-center">
                            <v-icon small class="text-center" 
                            color="red" @click="removeProduct(p)">mdi-delete</v-icon>
                            </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="pa-0 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Involucrados ({{projectData.workers.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table max-height="240px" >
                        <template v-slot:default>
                        <thead >
                            <tr>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Apellido
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            <th class="text-center">
                                Eliminar
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(worker,w) in projectData.workers"
                            :key="w"
                            >
                            <td class="text-center">{{ worker.name }}</td>
                            <td class="text-center">{{ worker.lastname }}</td>
                            <td class="text-center">{{ worker.roster }}</td>
                            <td v-if="w>0" class="text-center">
                                <v-icon small class="text-center" 
                                color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                            </td>
                            <td v-else class="text-center">
                                <v-icon small class="text-center" disabled
                                color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                            </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        

        <div style="display: flex; justify-content: space-between">
            <v-btn text color="red"
            @click="confirmCancel = true">
                Cancelar
            </v-btn>
            <v-btn text color="primary"
            @click="formStep = 3">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="saveProject()"
                >
                Guardar
                </v-btn>
        </div>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
  <v-snackbar
          v-model="alertError"
          type="error"
          top
          :timeout="timeout"
          color="error"
        >
          <strong class="body-1 font-weight-bold">
            {{errorMessage}}
          </strong>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              icon
              color="white"
              v-bind="attrs"
              @click="alertError = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
    </v-snackbar>
        <v-dialog v-model="confirmWorkers" max-width="500px">
            <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="body-1 text-center mx-auto">¿Seguro que no desea añadir <br> más involucrados además del líder?</v-card-title>
            <v-card-actions style="display: flex; justify-content: space-between">
                <v-spacer></v-spacer>
                <v-btn class="simple-btn-back" text @click="confirmWorkers = false">Regresar</v-btn>
                <v-btn class="simple-btn" text @click="formStep = 4; confirmWorkers = false">Sí, continuar</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-dialog v-model="confirmCancel" max-width="500px">
        <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="body-1 text-center mx-auto">¿Seguro que desea cancelar y salir?</v-card-title>
            <v-card-actions style="display: flex; justify-content: space-between">
                <v-spacer></v-spacer>
                <v-btn class="simple-btn-back" text @click="confirmCancel = false">No, seguir registrado</v-btn>
                <v-btn class="simple-btn" text @click="goRoute('projects')">Sí, salir</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>

</template>

<script>
import ProductDataService from "../../services/ProductDataService";
import UserDataService from "../../services/UserDataService";
import ProjectDataService from "../../services/ProjectDataService";
import AreaDataService from "../../services/AreaDataService";
export default {
  name: "projects-add",
  data: () => ({
      formStep: 1,
      projectData: {
          name: "",
          description: null,
          code: "",
          areas: 1,
          leader: null,
          products: [],
          workers: [],
      },

      roster_list: [
          "Director",
          "Gerente",
        //   "Líder",
          "Colaborador"
      ], 

      origin_products: [],
      temp_product_id: null,
      temp_product_name: null,
      temp_product_area: null,
      temp_product_estimated_hours: null,
      temp_product_obs: null,

      temp_area_id: null,
      temp_area_name: null,

      origin_workers: [],
      temp_worker_id: null,
      temp_worker_roster: null,

      origin_projects: [],
      error_add_workers: false,
      error_add_products: false,

      timeout: 4000,
      alertError: false,
      errorMessage: null,

      confirmWorkers: false,
      confirmCancel: false,
      counter: 1,
  }),
  computed: {
    currentUser() {    
      return this.$store.state.auth.user;
    },
    areas_list(){
        let n = this.projectData.areas;
        let list = [];
        for (let i = 1; i <= n; i++){
            if (i<10) list.push("A0" + i);
            else list.push("A" + i);
        }
        return list;
    },
    origin_products_rename(){
        let data = [];
        this.origin_products.forEach(product => {
            product.completeName = product.code + " - " + product.name;
            data.push(product);
        });
        return data;
    },
    origin_workers_admin() {
        let data = [];
        this.origin_workers.forEach(worker => {
            if (worker.rol.name == "Administrador") {
                data.push(worker);
            }
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    },
    origin_workers_projects() {
        let data = [];
        this.origin_workers.forEach(worker => {
            if (worker.rol.name == "Administrador" || worker.rol.name =="Proyectos") {
                data.push(worker);
            }
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    },
    origin_workers_hours() {
        let data = [];
        this.origin_workers.forEach(worker => {
            data.push(worker);
            worker.completeName = worker.name + " " + worker.lastname;
        });
        return data;
    }
  },
  methods: {
      codeIsCorrect(){
          if (this.projectData.code > 6999 && this.projectData.code < 8000) 
              return true;
          if (this.projectData.code > 3999 && this.projectData.code < 5000) 
              return true;
          return false;
      },
      validateStep1(){
          if (!this.projectData.name){
              this.errorMessage = "Debes indicar el nombre del proyecto."
              this.alertError = true;
          } else if (!this.projectData.code) {
              this.errorMessage = "Debes indicar el código del proyecto."
              this.alertError = true;
          } else if (!this.projectData.areas || this.projectData.areas<1) {
              this.errorMessage = "Al menos debe tener un (1) área de trabajo."
              this.alertError = true;
          } else if (!this.codeIsCorrect()) {
              this.errorMessage = "Verifique que el código inicie con 4 o 7, y que tenga cuatro (4) dígitos"
              this.alertError = true;
          } else {
              let itExists = false;
              this.origin_projects.forEach(project => {
                  if (this.projectData.code == project.code) {
                      itExists = true;
                  }
              });
              if (itExists) {
                  this.errorMessage = "Ya existe un proyecto con el código " + this.projectData.code;
                  this.alertError = true;
              }
              else {
                  this.formStep = 2;
                  if (this.counter == 1){
                      this.projectData.workers.push({
                        id: this.currentUser.id, 
                        roster: "Líder",
                        name: this.currentUser.name,
                        lastname: this.currentUser.lastname,
                    });
                    this.counter++;
                  }
              }
          }
      },
      validateStep2(){
          if (this.projectData.products.length < 1){
              this.errorMessage = "Debes añadir al menos un (1) producto."
              this.alertError = true;
          } else this.formStep = 3;
      },
      validateStep3(){
          if (this.projectData.workers.length < 2){
              this.confirmWorkers = true;
          } else this.formStep = 4;
      },
      retrieveProducts() {
      ProductDataService.getAll()
        .then((response) => {
          this.origin_products = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addProductToProject(){
        let product_name = "";
        let product_code = "";
        let itExists = false;
        if (!this.temp_product_id){
            this.errorMessage = "Debes indicar el producto."
            this.alertError = true;
        } else if (!this.temp_product_estimated_hours){
            this.errorMessage = "Debes indicar las horas estimadas."
            this.alertError = true;
        } else if (!this.temp_product_area){
            this.errorMessage = "Debes indicar el área de trabajo."
            this.alertError = true;
        } else {
            this.projectData.products.forEach(product => {
                if (product.name == this.temp_product_name) itExists = true;
            });
            if (!itExists) {
                this.origin_products.forEach(op => {
                    if (op.id==this.temp_product_id) {
                        product_name = op.name;
                        product_code = op.code;
                    } 
                });
                this.projectData.products.push({
                    id: this.temp_product_id, 
                    estimated_hours: this.temp_product_estimated_hours,
                    name: product_name,
                    code: product_code,
                    area: this.temp_product_area,
                });
                this.temp_product_id = "",
                this.temp_product_estimated_hours = "",
                this.temp_product_area = ""
            } else {
                this.errorMessage = "Ya se agregó un producto con ese nombre a este proyecto."
               this.alertError = true;
            }
        }
    },
    removeProduct(pos){
        return this.projectData.products.splice(pos, 1);
    },
    retrieveUsers() {
      UserDataService.getAll()
        .then((response) => {
          this.origin_workers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveProjects() {
      ProjectDataService.getAll()
        .then((response) => {
          this.origin_projects = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    addWorkerToProject(){
        let worker_name = "";
        let worker_lastname = "";
        let itExists = false;
        if (!this.temp_worker_roster){
            this.errorMessage = "Debes indicar el rol del involucrado."
            this.alertError = true;
        } else if (!this.temp_worker_id){
            this.errorMessage = "Debes indicar el involucrado a añadir."
            this.alertError = true;
        } else {
            this.projectData.workers.forEach(worker => {
                if (worker.id == this.temp_worker_id) itExists = true;
            });
            if (!itExists) {
                this.origin_workers.forEach(op => {
                    if (op.id==this.temp_worker_id) {
                        worker_name = op.name;
                        worker_lastname = op.lastname;
                    } 
                });
                this.projectData.workers.push({
                    id: this.temp_worker_id, 
                    roster: this.temp_worker_roster,
                    name: worker_name,
                    lastname: worker_lastname,
                });
            } else {
               this.errorMessage = "Ya está agregado."
               this.alertError = true;
            }
        }
    },
    removeWorker(pos){
        return this.projectData.workers.splice(pos, 1);
    },
    async saveProject() {
      var data = {
        name: this.projectData.name,
        description: this.projectData.description,
        code: this.projectData.code,
        areas: this.projectData.areas,
        leader: this.currentUser.id,
      };
      let project_id = await ProjectDataService.create(data);

        let productData = null;

        let area_id = null;

        let areaData = null;

        for (let i = 0; i < this.areas_list.length; i++) {
            areaData = {
                name: this.areas_list[i],
                project: project_id.data.id
            }

            area_id = await AreaDataService.create(areaData);
        
            for (let index = 0; index < this.projectData.products.length; index++) {
                
                if (this.projectData.products[index].area == this.areas_list[i]){
                
                    productData = {
                        product: this.projectData.products[index].id,
                        estimated_hours: this.projectData.products[index].estimated_hours,
                        area: area_id.data.id
                    }

                    console.log(productData);

                    AreaDataService.addProduct(productData)
                        .then(response => {
                        console.log(response.data);
                        })
                        .catch(e => {
                        console.log(e);
                        });
                }
            }
        }

        let workerData = null;
        this.projectData.workers.forEach(workerToAdd => {    
            workerData = {
                project: project_id.data.id,
                worker: workerToAdd.id,
                roster: workerToAdd.roster,
            }
            console.log(workerData);

            ProjectDataService.addUser(workerData)
                .then(response => {
                console.log(response.data);
                })
                .catch(e => {
                console.log(e);
                });
        });

        this.goRoute("projects");

    },
    console(){
        console.log(this.projectData);
        console.log(this.origin_projects);
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
      this.retrieveProducts();
      this.retrieveUsers();
      this.retrieveProjects();
  }
}
</script>

<style>
    .stepper-project{
        width: 60%;
    }
    .add-product-section{
        border: 1px solid lightgray;
        border-radius: 20px;
        padding-top: 10px;
        margin-bottom: 10px;
    }
    .project-confirm-section{
        border: 1px solid lightgray;
        border-radius: 10px;
        padding: 8px;
    }
  .no-items-label{
      background-color: rgba(219, 214, 214, 0.301);
      border-radius: 10px;
  }
</style>