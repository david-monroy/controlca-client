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
        Colaboradores
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
                    ></v-text-field>
                </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
                <div class="form-group">
                    <v-text-field
                        v-model="projectData.area"
                        name="area"
                        label="Área de trabajo"
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
                        label="Descripción"
                        required
                    ></v-textarea>
                </div>
            </v-col>
          </v-row>

        <div style="display: flex; justify-content: space-between">
            <v-btn text>
                Cancelar
            </v-btn>
            <v-btn
                color="primary"
                @click="formStep = 2"
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
                                Nro.
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
                        <td class="text-center">{{ p+1 }}</td>
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
        <v-expansion-panels focusable class="px-5 mt-2 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir producto</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
            <v-row class="pa-0 ma-0 form-row-rol">
            <v-select
                v-model="temp_product_id"
                :items="origin_products"
                label="Producto"
                item-text="name"
                item-value="id"
                dense
                required
              ></v-select>
        </v-row>
        <v-row class="pa-0 ma-0 mb-0 form-row-rol">
            <v-text-field
                v-model="temp_product_estimated_hours"
                label="Horas estimadas"
                suffix="horas"
                type="number"
            ></v-text-field>
        </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block" @click="addProductToProject()">
          Añadir producto al proyecto
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>
           
        <div style="display: flex; justify-content: space-between">
            <v-btn text
            >
                Cancelar
            </v-btn>
            <v-btn text
            @click="formStep = 1">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="formStep = 3"
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
                                Nro.
                            </th>
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
                        <td class="text-center">{{ w+1 }}</td>
                        <td class="text-center">{{ worker.name }}</td>
                        <td class="text-center">{{ worker.lastname }}</td>
                        <td class="text-center">{{ worker.roster }}</td>
                        <td class="text-center">
                            <v-icon small class="text-center" 
                            color="red" @click="removeWorker(w)">mdi-delete</v-icon>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
        </div>
        <v-expansion-panels focusable class="px-5 mt-2 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Añadir colaborador</v-expansion-panel-header>
                <v-expansion-panel-content class="py-4">
            <v-row class="pa-0 ma-0 form-row-rol">
            <v-select
                v-model="temp_worker_id"
                :items="origin_workers"
                label="Colaborador"
                item-text="email"
                item-value="id"
                dense
                required
              ></v-select>
        </v-row>
        <v-row class="pa-0 ma-0 mb-0 form-row-rol">
            <v-text-field
                v-model="temp_worker_roster"
                label="Rol"
                type="text"
            ></v-text-field>
        </v-row>
        <v-btn class="simple-btn mt-2 mx-auto btn-block" @click="addWorkerToProject()">
          Añadir colaborador al proyecto
        </v-btn>
        </v-expansion-panel-content>
        </v-expansion-panel>
        </v-expansion-panels>

        <div style="display: flex; justify-content: space-between">
            <v-btn text>
                Cancelar
            </v-btn>
            <v-btn text
            @click="formStep = 2">
                Regresar
            </v-btn>
            <v-btn
                color="primary"
                @click="formStep = 4"
                >
                Siguiente
                </v-btn>
        </div>
      </v-stepper-content>
      <v-stepper-content step="4">

        <div class="project-confirm-section pa-4 body-2 mb-4">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <strong>Código: </strong> <p>{{projectData.code}}</p>
                </div>
                <div>
                    <strong>Área: </strong> <p>{{projectData.area}}</p>
                </div>
                <div>
                    <strong>Líder: </strong> <p>{{currentUser.name}} {{currentUser.lastname}}</p>
                </div>
            </div>
            
            <div class="mb-2 pb-0 body-2">
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
                                Nro.
                            </th>
                            <th class="text-center">
                                Producto
                            </th>
                            <th class="text-center">
                                Horas estimadas
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(product,p) in projectData.products"
                            :key="p"
                            >
                            <td class="text-center">{{ p+1 }}</td>
                            <td class="text-center">{{ product.name }}</td>
                            <td class="text-center">{{ product.estimated_hours }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="pa-0 mb-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Colaboradores ({{projectData.workers.length}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table max-height="240px" >
                        <template v-slot:default>
                        <thead >
                            <tr>
                            <th class="text-center">
                                Nro.
                            </th>
                            <th class="text-center">
                                Nombre
                            </th>
                            <th class="text-center">
                                Apellido
                            </th>
                            <th class="text-center">
                                Rol
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(worker,w) in projectData.workers"
                            :key="w"
                            >
                            <td class="text-center">{{ w+1 }}</td>
                            <td class="text-center">{{ worker.name }}</td>
                            <td class="text-center">{{ worker.lastname }}</td>
                            <td class="text-center">{{ worker.roster }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        

        <div style="display: flex; justify-content: space-between">
            <v-btn text>
                Cancelar
            </v-btn>
            <v-btn text
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
    </div>

</template>

<script>
import ProductDataService from "../../services/ProductDataService";
import UserDataService from "../../services/UserDataService";
import ProjectDataService from "../../services/ProjectDataService";
export default {
  name: "projects-add",
  data: () => ({
      formStep: 1,
      projectData: {
          name: "",
          description: "",
          code: "",
          area: "",
          leader: null,
          products: [],
          workers: [],
      },
      origin_products: [],
      temp_product_id: null,
      temp_product_estimated_hours: null,

      origin_workers: [],
      temp_worker_id: null,
      temp_worker_roster: null,

      origin_projects: [],
      error_add_workers: false,
      error_add_products: false,
  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  methods: {
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
        let itExists = false;
        this.projectData.products.forEach(product => {
            if (product.id == this.temp_product_id) itExists = true;
        });
        if (!itExists) {
            this.origin_products.forEach(op => {
                if (op.id==this.temp_product_id) product_name = op.name;
            });
            this.projectData.products.push({
                id: this.temp_product_id, 
                estimated_hours: this.temp_product_estimated_hours,
                name: product_name
            });
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
        area: this.projectData.area,
        leader: this.currentUser.id,
      };
      let project_id = await ProjectDataService.create(data);

        console.log(project_id.data.id);
        let productData = null;
        let consecutive_counter = 1;
        this.projectData.products.forEach(productToAdd => {
            productData = {
                project: project_id.data.id,
                product: productToAdd.id,
                estimated_hours: productToAdd.estimated_hours,
                consecutive: consecutive_counter,
            }
            consecutive_counter = consecutive_counter + 1;

            console.log(productData);

            ProjectDataService.addProduct(productData)
                .then(response => {
                console.log(response.data);
                })
                .catch(e => {
                console.log(e);
                });
        });

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
</style>