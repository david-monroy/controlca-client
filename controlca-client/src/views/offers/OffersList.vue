<template>
  <div id="offers">
    <v-card
    class="mx-auto main-card-offers"
    >
      <v-card-text>
        <v-row>
          <v-col cols="12" class="item-list-offers"
          v-if="currentUser.id == 1">
            <v-card v-if="offers.length < 1" class="mx-auto">
              <v-card-text>
                <h5>No hay ofertas registradas en el sistema.</h5>
              </v-card-text>
            </v-card>
            <div
              v-for="item in offers"
              :key="item.id"
            >
              <OfferCard
                :name="item.name"
                :description="item.description"
                :code="item.code"
                :department="item.department"
                :status="item.status"
                :users="item.working_users"
                :leader="item.leader"
                :id="item.id"
                :budgets="item.budget_offers"
              >
              </OfferCard>
            </div>
          </v-col>
          <v-col cols="12" class="item-list-offers"
          v-else>
            <v-card v-if="offersByLeader.length < 1" class="mx-auto">
              <v-card-text>
                <h5>No hay ofertas registradas por usted en el sistema.</h5>
              </v-card-text>
            </v-card>
            <div
              v-for="item in offersByLeader"
              :key="item.id"
            >
              <OfferCard
                :name="item.name"
                :description="item.description"
                :code="item.code"
                :department="item.department"
                :status="item.status"
                :users="item.working_users"
                :leader="item.leader"
                :id="item.id"
                :budgets="item.budget_offers"
              >
              </OfferCard>
            </div>

          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn class="simple-btn mt-2 mx-auto w-50 d-none d-sm-flex" @click="goRoute(addOffer)">
          Registrar Oferta
        </v-btn>
        <v-btn class="simple-btn mt-2 mx-auto w-75 d-flex d-sm-none" @click="goRoute(addOffer)">
          Registrar Oferta
        </v-btn>
      </v-card-actions>
      
    </v-card>
  </div>
</template>

<script>
import OfferCard from "../../components/offers/OfferCard.vue";
import OfferDataService from "../../services/OfferDataService";
export default {
  name: "offers",
  components: {
    OfferCard
  },
  data: () => ({
    offers: [],
    addOffer: 'offers-add',
    offersByLeader: [],
  }),
  computed: {
    currentUser() {      
      return this.$store.state.auth.user;
    },
  },
  methods: {
    retrieveOffers() {
      OfferDataService.getAll()
        .then((response) => {
          this.offers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    retrieveOffersByLeader() {
      OfferDataService.getByLeader(this.currentUser.id)
        .then((response) => {
          this.offersByLeader = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    goRoute(route) {
      this.$router.push("/" + route);
    },
  },
  mounted() {
    this.retrieveOffers();
    this.retrieveOffersByLeader();
    console.log(this.offers)
  },
  
};
</script>

<style>
.main-card-offers{
    width: 100%;
    padding: 30px;
  }
  .item-list-offers{
    display: flex;
    justify-content: flex-start;
    min-height: 450px;
    padding: 0 20px;
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }
  @media only screen and (max-width: 992px) {
    .item-list-offers{
    display: flex;
    justify-content: flex-start;
    min-height: 450px;
    padding: 0;
    align-items: flex-start;
    flex-direction: column;
    flex-wrap: nowrap;
  }
  }


</style>