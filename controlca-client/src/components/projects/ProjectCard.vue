<template>
  
<v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card 
        class="pa-5 ma-0 project-card" 
        @click="goRoute(route)"
        outlined
        >
    <v-card-title class="p-0 headline font-weight-bold "> {{ name }} </v-card-title>
    <v-card-text class="p-0">
      
      <div class="project-card-chips my-2">
          <v-chip
            class="ma-0" small label
            >
            {{code}}
          </v-chip>
          <v-chip
            class="ma-0 ml-2 color-chip" small label
            >
            {{area}}
          </v-chip>
      </div>
      

      <div class="project-card-info">
        <p class="m-0">Productos: {{products.length}}</p>
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
                <strong>Área: </strong> <p>{{area}}</p>
            </div>
            <div>
                <strong>Líder: </strong> <p>{{leader.name}} {{leader.lastname}}</p>
            </div>
            <div>
                <strong>Status: </strong> <p>{{status}}</p>
            </div>
          
        </v-card-text>

        <v-card-text class="mb-2 pb-0 body-2">
          <p><strong>Descripción: </strong>{{description}}</p> 
        </v-card-text>

        <v-expansion-panels focusable class="px-5 mb-2">
            <v-expansion-panel>
                <v-expansion-panel-header>Productos ({{products.length}})</v-expansion-panel-header>
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
                                Horas completadas
                            </th>
                            <th class="text-center">
                                Horas estimadas
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(product,p) in products"
                            :key="p"
                            >
                            <td class="text-center">{{ p+1 }}</td>
                            <td class="text-center">{{ product.name }}</td>
                            <td class="text-center">0</td>
                            <td class="text-center">{{ product.project_product.estimated_hours }}</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels focusable class="px-5">
            <v-expansion-panel>
                <v-expansion-panel-header>Colaboradores ({{users.length}})</v-expansion-panel-header>
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
                            <th class="text-center">
                                Horas completadas
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="(user,u) in users"
                            :key="u"
                            >
                            <td class="text-center">{{ u+1 }}</td>
                            <td class="text-center">{{ user.name }}</td>
                            <td class="text-center">{{ user.lastname }}</td>
                            <td class="text-center">{{ user.project_user.rol_in_project }}</td>
                            <td class="text-center">0</td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
  name: "DashboardCard",
  props: {
    name: String,
    description: String,
    code: String,
    area: String,
    status: String,
    leader: Object,
    products: Array,
    users: Array,
  },
  data: () => ({
      dialog: false,
      associations: [
          {
              title: "Productos",
              array: "products"
          },
          {
              title: "Colaboradores",
              array: "users"
          }
      ]
  }),
  methods: {
    goRoute(route) {
      this.$router.push("/" + route);
    },
    openDialog(){
        this.dialog = true;
        this.goRoute('projects');
    }
  }
};
</script>

<style>
    .project-card{
        width: 240px;
        max-height: 240px;
        border: 1px solid #00917c  !important;
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
</style>