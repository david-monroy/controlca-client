<template>
  <div>
<v-dialog
      v-model="dialog"
      width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card 
        class="pa-5 ma-2 project-card" 
        @click="goRoute(route)"
        outlined
        >
    <v-card-title class="p-0 body-1 font-weight-bold project-card-title"> {{ name }} </v-card-title>
    <v-card-text class="p-0">
      <div style="display: flex;">
        <h4 class="p-0 body-1 font-weight-bold project-card-title-mobile"> {{ name }}</h4>
      <div class="project-card-chips my-2">
          <v-chip
            class="ma-0 text-left project-card-chips-code" small label
            >
          {{code}}
          </v-chip>
          <v-chip
            class="ma-0 ml-2 color-chip text-left project-card-chips-status" small label
            >
          {{status}}
          </v-chip>
          <v-chip
            class="ma-0 ml-2 text-left project-card-chips-budget" small label
            >
          ${{total_budget}}
          </v-chip>
      </div>
      </div>
      
      

      <div class="project-card-info">
        <p class="m-0">Productos: {{project_products.length}}</p>
        <p class="m-0">Colaboradores: {{users.length}}</p>
      </div>
      
    </v-card-text>
    <v-card-actions class="p-0 mt-2">
      <v-btn
        text small
        v-bind="attrs"
          v-on="on"
        class="project-card-btn mx-auto btn-block"
        @click="openDialog"
      >
        Más detalles
      </v-btn>
    </v-card-actions>

  </v-card>
      </template>

      <v-card class="project-dialog">
        <v-card-title class="headline grey lighten-2">
          {{name}}
        </v-card-title>

        <v-card-text class="my-2 project-dialog-info pb-0">
            <div>
                <strong>Código: </strong> <p>{{code}}</p>
            </div>
            <div>
                <strong>Áreas: </strong> <p>{{areas}}</p>
            </div>
            <div>
                <strong>Líder: </strong> <p>{{leader.name}} {{leader.lastname}}</p>
            </div>
            <div>
                <strong>Status: </strong> <p>{{status}}</p>
            </div>
          
        </v-card-text>
        <v-card-text class="mb-2 pb-0 body-2">
          <p class="mb-1" ><strong>Total de horas trabajadas: </strong>{{worked_hours}}/{{total_estimated_hours}}</p> 
          <p v-if="worked_hours_percent > 85" style="color: red"><v-icon style="color: red">mdi-alert-octagon</v-icon> ¡Según la estimación, ya se han cargado el {{worked_hours_percent}}% de las horas!</p>
        </v-card-text>
        <v-card-text class="mb-2 pb-0 body-2" v-if="description">
          <p><strong>Descripción: </strong>{{description}}</p> 
        </v-card-text>

        <v-expansion-panels focusable class="px-5 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Productos ({{project_products.length}})</v-expansion-panel-header>
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
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(product,p) in project_products"
                            :key="p"
                            >
                            <td class="text-center">{{ product.area_name }}</td>
                            <td class="text-center">{{ product.code }}</td>
                            <td class="text-center">{{ product.name }}</td>
                            <td class="text-center">{{ product.area_product.estimated_hours }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="px-5 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Colaboradores ({{users.length}})</v-expansion-panel-header>
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
                            <!-- <th class="text-center">
                                Horas completadas
                            </th> -->
                            <th class="text-center">
                                Estatus
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(user,u) in users"
                            :key="u" 
                            >
                            <td class="text-center">{{ user.name }}</td>
                            <td class="text-center">{{ user.lastname }}</td>
                            <td class="text-center">{{ user.project_user.roster }}</td>
                            <!-- <td class="text-center">0</td> -->
                            <td v-if="user.project_user.status == true" class="text-center">Activo</td>
                            <td v-else class="text-center red--text">Inactivo</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="px-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Presupuesto (USD$ {{total_budget}})</v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-simple-table max-height="240px" >
                        <template v-slot:default>
                        <thead >
                            <tr>
                            <th class="text-center">
                                Rubro
                            </th>
                            <th class="text-center">
                                Precio
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(bud,u) in budgets"
                            :key="u"
                            >
                            <td class="text-center">{{ bud.area }}</td>
                            <td class="text-center">${{ bud.price }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-card-actions>
            <v-btn
            color="red"
            text
            @click="openDelete()"
          >
            Eliminar
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="editProject()"
          >
            Editar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="goReports()"
          >
            Reportes
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
        <template>
              <v-dialog v-model="dialogDelete" max-width="400px" class="pa-0">
                <v-card style="display: flex; justify-content: center; flex-direction: column">
                  <v-card-title class="headline text-center mx-auto">¿Seguro que desea eliminar <br> este proyecto?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="simple-btn-back" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn class="simple-btn" text @click="deleteProject()">Sí, eliminar</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>
      </v-card>
    </v-dialog>
    <v-snackbar
          v-model="alertSuccess"
          type="success"
          top
          :timeout="timeout"
          color="success"
        >
          <strong class="body-1 font-weight-bold">
            {{successMessage}}
          </strong>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              icon
              color="white"
              v-bind="attrs"
              @click="alertSuccess = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
    </div>
</template>
<script>
import ProjectDataService from "../../services/ProjectDataService";
import ProjectUserDataService from "../../services/ProjectUserDataService";
import AreaDataService from "../../services/AreaDataService";
export default {
  name: "DashboardCard",
  props: {
    name: String,
    description: String,
    code: String,
    areas: Number,
    status: String,
    leader: Object,
    products: Array,
    users: Array,
    id: Number,
    budgets: Array,
  },
  data: () => ({
      dialog: false,
      dialogDelete: false,
      projectToDelete: "",
      associations: [
          {
              title: "Productos",
              array: "products"
          },
          {
              title: "Colaboradores",
              array: "users"
          }
      ],
      origin_project_users: [],
      origin_areas: [],
      alertSuccess: false,
      successMessage: "Proyecto eliminado correctamente. Espere mientras se actualiza.",
      timeout: 4000,
  }),
  computed: {
    area_products(){
        let products = [];
        // let project_id = this.currentProjectId;
        this.origin_areas.forEach(area => {
            if (area.project_id == this.id){
                 area.products.forEach(prod => {
                  prod.area_name = area.name;
                  products.push(prod);
                 });      
            }            
        });
        return products;
    },
    worked_hours(){
      let hours = 0;
      this.origin_project_users.forEach(pu => {
        if (this.id == pu.project_id){
          pu.loads.forEach(load => {
            hours = hours + load.hours;
          });
        }
      });
      return hours;
    },
    total_estimated_hours(){
        let hours = 0;
        this.area_products.forEach(prod => {
            hours += prod.area_product.estimated_hours;
        });
        return hours;
    },
    worked_hours_percent(){
        let percent = (this.worked_hours * 100)/this.total_estimated_hours;
        return percent.toFixed(0);
    },
    project_products(){
      let products = [];
      this.origin_areas.forEach(area => {
        if (area.project_id == this.id){
          area.products.forEach(p => {
            p.area_name = area.name;
            products.push(p);
          });  
        }
      });
      return products;
    },
    total_budget(){
        let total = 0;
        this.budgets.forEach(b => {
            total += b.price;
        });
        return total;
    }
  },
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
    goReports() {
      this.$router.push("/reports/" + this.id);
    },
    openDialog(){
        this.dialog = true;
        console.log(this.products)
    },
    editProject() {
      let id = this.id;
      this.$router.push({ name: "projects-details", params: { id: id } });
    },
    closeDelete(){
      this.dialogDelete = false;
    },
    openDelete(){
      this.dialogDelete = true;
      this.projectToDelete = this.id;
    },
    deleteProject() {
      let id = this.projectToDelete;
      ProjectDataService.delete(id)
        .then(() => {
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
      this.closeDelete();
      this.dialog = false;
      this.alertSuccess = true;
      location.reload();
      return false;
    },
    retrieveProjectUsers() {
      ProjectUserDataService.getAll()
        .then((response) => {
          this.origin_project_users = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveAreas() {
      AreaDataService.getAll()
        .then((response) => {
          this.origin_areas = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    this.retrieveProjectUsers();
    this.retrieveAreas();
  },
};
</script>

<style>
    .project-card{
        width: 250px;
        max-height: 240px;
        border: 1px solid #00917c  !important;
        padding: 8px;
        background-color:rgb(247, 245, 245) !important;
    }
    .project-card-info, .project-dialog-info {
        display: flex;
        justify-content: space-between;
    }
    .project-card-chips {
        display: flex;
        justify-content: flex-start;
    }
    .project-card-title {
        color: #00917c  !important;
    }
    .color-chip{
        background-color: blanchedalmond !important;
    }
    .project-card-btn{
        border: 1px solid #00917c !important;
        transition: 0.3s;
        background-color:ghostwhite;
        color: #00917c !important;
    }
    .project-card-btn:hover{
        background-color: #00917c !important;
        color: white !important;
    }
    .project-card-title-mobile{
      display: none;
    }

     @media only screen and (max-width: 992px) {
       .project-card{
       width: 800px !important;
        max-height: 240px;
        border: 1px solid #00917c  !important;
        padding: 8px;
        background-color:rgb(247, 245, 245) !important;
    }

    .project-card-title-mobile{
      display: inline;
    }

    .project-card-info, .project-card-title{
        display: none;
    }
     }
</style>