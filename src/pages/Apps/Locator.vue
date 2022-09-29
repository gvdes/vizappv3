<template>

  <q-page >
    <div class="bg-white">
      <div class="q-pa-sm row items-center">
        <div class="col anek-bld text-grey-9 q-pl-sm">UBICADOR</div>
        <div>
          <q-btn flat rounded icon="support" />
        </div>
      </div>
      <q-separator/>
    </div>

    <div :class="isMobile ? 'q-py-md':'q-pa-md'">
      <q-card flat bordered>
        <template v-if="locandpro">
          <q-card-actions align="center">
            <q-btn rounded icon="close" color="warning" @click="clearBoth"/>
            <q-btn rounded icon="link_off" ref="tglink" color="negative" v-if="linkExist" @click="toggleLink" :loading="btntoggle.state" :disable="btntoggle.state"/>
            <q-btn rounded icon="add_link" ref="tglink" color="primary" v-else @click="toggleLink" :loading="btntoggle.state" :disable="btntoggle.state"/>
          </q-card-actions>
          <q-separator />
        </template>

        <q-card-section horizontal> <!-- APERTURA DE CARD PRINCIPAL -->

          <!-- ########## SECCION DE UBICACION ########## -->
          <q-card-section class="q-py-none col">
            <!-- FORMULARIO DE BUSQUEDA DE UBICACION  -->
            <q-form v-if="!location.section"
              @submit="validateLocation"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              class="q-pb-md"
            >
              <q-input autofocus
                input-class="anek-bld text-h6 text-center text-uppercase"
                v-model="location.target"
                label="Capture Ubicacion"
                ref="iptloc"
                type="text"
                icon="fas fa-map-location-dot"
              >
                <template v-slot:prepend><q-icon name="fas fa-map-location-dot" /></template>
              </q-input>
            </q-form>

            <!-- VISTA DEL PRODUCTO -->
            <q-card-section v-else class="q-px-none">
              <q-btn flat rounded color="red" icon="far fa-circle-xmark" class="full-width" @click="clearLocation"/>
              <q-card-section class="q-px-none">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>ID: {{location.section.id}}</q-item-label>
                      <q-item-label class="text-h5 anek-bld">{{location.section.path}}</q-item-label>
                      <q-item-label>{{location.section.name}}</q-item-label>
                      <q-item-label>Almacen: <span class="anek-bld">{{location.warehouse.alias}}</span> ({{location.warehouse.name}})</q-item-label>
                      <q-item-label>Sucursal: <span class="anek-bld">{{location.warehouse.store.name}}</span> ({{location.warehouse.store.alias}})</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pa-none">
                <div class="text-center anek-bld q-pa-md">Productos: {{location.products.length}}</div>
                <q-list separator>
                  <q-item class="q-px-none" v-for="(product) in location.products" :key="product.id">
                    <q-item-section side v-if="!isMobile">
                      <q-btn color="red" size="sm" round flat icon="fas fa-trash" @click="unlink(product.id,location.section.id)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>ID: {{product.id}}</q-item-label>
                      <q-item-label class="anek-bld">{{product.code}}</q-item-label>
                      <q-item-label>{{product.short_code}}</q-item-label>
                      <q-item-label caption>{{product.description}}</q-item-label>
                      <template v-if="isMobile">
                        <q-item-label class="row justify-between items-center">
                          <q-btn color="red" size="sm" rounded flat icon="fas fa-trash" @click="unlink(product.id,location.section.id)" />
                          <q-btn dense flat no-caps color="primary" class="anek-bld" :label="`Stock: ${glstock(product.stocks)}`" @click="displayStocks(product)"/>
                        </q-item-label>
                      </template>
                    </q-item-section>
                    <q-item-section side v-if="!isMobile">
                      <q-btn dense flat no-caps color="primary" class="anek-bld" :label="`Stock: ${glstock(product.stocks)}`" @click="displayStocks(product)"/>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card-section>

          <q-separator vertical />

          <!-- ########## SECCION DEL PRODUCTO ########## -->
          <q-card-section class="q-py-none col"><!-- APERTURA DE SECCION DEL PRODUCTO -->
            <!-- FORMULARIO DE BUSQUEDA DEL PRODUCTO -->
            <q-form v-if="!product.data"
              @submit="productFinder"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              class="q-pb-md"
            >
              <q-input
                input-class="anek-bld text-h6 text-center text-uppercase"
                v-model="product.target"
                label="Capture Producto"
                ref="iptpro"
                type="text"
              >
                <template v-slot:prepend><q-icon name="fas fa-boxes-packing" /></template>
              </q-input>
            </q-form>

            <!-- VISTA DE UBICACIONES -->
            <q-card-section v-else class="q-px-none">
              <q-btn flat rounded color="red" icon="far fa-circle-xmark" class="full-width" @click="clearProduct"/>
              <q-card-section class="q-px-none">
                <q-list>
                  <q-item v-if="product.additional" class="bg-yellow-14">
                    <q-item-section avatar><q-icon name="warning" /></q-item-section>
                    <q-item-section>
                      <q-item-label>
                        El codigo <span class="anek-bld text-uppercase">{{product.target}}</span> es un asociado a <span class="anek-bld text-uppercase">{{product.data.code}}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>ID: {{product.data.id}}</q-item-label>
                      <q-item-label class="text-h5 anek-bld">{{product.data.code}}</q-item-label>
                      <q-item-label>CC: {{product.data.short_code}}</q-item-label>
                      <q-item-label v-if="product.data.barcode">CB: {{product.data.barcode}}</q-item-label>
                      <q-item-label v-else class="text-red anek-bld">CB: --- </q-item-label>
                      <q-item-label caption>{{product.data.description}}</q-item-label>
                      <q-item-label>
                        <q-btn dense flat no-caps color="primary" class="anek-bld" :label="`Stock: ${glstock(product.stocks)}`" @click="displayStocks()"/>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pa-none">
                <q-list separator>
                  <div class="text-center anek-bld q-pa-md">Ubicaciones: {{product.locations.length}}</div>
                  <q-item class="q-px-none" v-for="(location) in product.locations" :key="location.id">
                    <q-item-section side>
                      <q-btn color="red" size="sm" round flat icon="fas fa-trash" @click="unlink(product.data.id,location.id)" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>ID: {{location.id}}</q-item-label>
                      <q-item-label class="anek-bld">{{location.path}}</q-item-label>
                      <q-item-label caption>Almacen: {{location.warehouse.name}}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card-section><!-- CIERRE DE formulario de busqueda DEL PRODUCTO -->

        </q-card-section><!-- CIERRE DEL CARD PRINCIPAL -->
      </q-card>
    </div>

    <q-dialog v-model="wndDispStocks.state">
      <q-card>
        <q-card-section>
          <div class="text-h6">Stock: <span class="anek-bld">{{wndDispStocks.data.code}}</span></div>
          <div>{{wndDispStocks.data.description}}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-list separator>
            <q-item v-for="(stock,idx) in wndDispStocks.stocks" :key="idx">
              <q-item-section>
                <q-item-label class="text-dark anek-bld">{{stock.warehouse.alias}}</q-item-label>
                <q-item-label caption>{{stock.warehouse.name}}</q-item-label>
              </q-item-section>
              <q-item-section avatar class="text-h6 anek-bld">{{stock.current}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn no-caps label="Ok" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { ref, onBeforeMount, computed, nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import Locator from 'src/API/LocatorApi';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const iptloc = ref(null);
  const iptpro = ref(null);
  const tglink = ref(null);
  const btntoggle = ref({state:false});
  const wndDispStocks = ref({state:false,data:null,stocks:null});

  const location = ref({
		target:null,
		warehouse:null,
		section:null,
		parents:null,
		products:[]
	});

	const product = ref({
		target:null,
		data:null,
    additional:null,
		locations:[],
    stocks:[],
    relateds:[]
	});

  const isMobile = computed(() => $q.platform.is.mobile);
  const locandpro = computed(() => (product.value.data&&location.value.section));
  const linkExist = computed(() => locandpro.value ? (location.value.products.find( p => p.id==product.value.data.id ) ? true : false) : false )
  const glstock = computed(() => { return stocks => stocks.reduce( ( carry, w) => carry+w.current, 0) } );
  // const glstock = computed(() => { return stocks => stocks.filter( w => w._type <= 2).reduce( ( carry, w) => carry+w.current, 0) } );

  const validateLocation = async () => {
    if(location.value.target){
      console.log("buscando ubocacion");
      const resp = await Locator.location(location.value.target);
      console.log(resp);

      if(resp.id){
        location.value.section = resp;
        location.value.warehouse = resp.warehouse;
        location.value.products = resp.products;
        (!product.value.data) ? iptpro.value.focus() : null;
      }else{
        location.value.target = null;
        $q.notify({
          message:'Lo siento vaquero, no encontre la ubicacion!',
          icon:'fas fa-close',
          color:'negative'
        });
      }
    }
  }

  const productFinder = async () => {
    if(product.value.target){
      console.log("Buscano producto");
      const resp = await Locator.product(product.value.target);
      console.log(resp);

      if(resp.product){
        product.value.data = resp.product;
        product.value.locations = resp.product.locations;
        product.value.additional = resp.additional;
        (!location.value.section) ? iptloc.value.focus() : null;
        product.value.stocks = resp.product.stocks;
        product.value.relateds = resp.product.relateds;
      }else{
        product.value.target = null;
        $q.notify({
          message:'Lo siento vaquero, no encontre el producto!',
          icon:'fas fa-close',
          color:'negative'
        });
      }
    }
  }

  const clearLocation = () => {
    location.value.target = null;
    location.value.warehouse = null;
    location.value.section = null;
    location.value.parents = null;
    location.value.products = [];
  }

  const clearProduct = () => {
    product.value.target = null;
    product.value.data = null;
    product.value.additional = null;
    product.value.locations = [];
    nextTick(() => location.value.section ? iptpro.value.focus() : iptloc.value.focus());
  }

  const clearBoth = () => { clearProduct(); clearLocation(); }

  const toggleLink = async () => {
    let loc = location.value.section.id;
    let pro = product.value.data.id;
    let data = {loc,pro,opt:linkExist.value};
    btntoggle.value.state = true;
    const resp = await Locator.toggle(data);
    product.value.locations = resp.product.locations;
    location.value.products = resp.location.products;
    btntoggle.value.state = false;
  }

  const unlink = async (pro,loc) => {
    let data = {loc,pro,opt:true};
    const resp = await Locator.toggle(data);
    console.log(resp);
    product.value.data ? product.value.locations = resp.product.locations : null;
    location.value.section ?  location.value.products = resp.location.products : null;
  }

  const displayStocks = (pro) => {
    wndDispStocks.value.state = true;
    wndDispStocks.value.data = pro ? pro : product.value.data;
    wndDispStocks.value.stocks = pro ? pro.stocks : product.value.stocks;

    console.log(product);
  }
</script>
