<template>
  <div class="q-pa-sm">

    <q-table
      flat ref="tableprods"
      :rows="productsdb"
      :columns="table.columns"
      row-key="id"
      :pagination="table.pagination"
    />

  </div>
</template>

<script setup>
  import { ref, computed, onBeforeMount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar, LocalStorage, Loading } from 'quasar';
  import { useAccountStore } from 'stores/Account';
  import { useWarehouseStore } from 'stores/Warehouse';
  import Wapi from 'src/API/WarehouseApi';

  const $q = useQuasar();
  const $route = useRoute();
  const $router = useRouter();
  const piniaAccount = useAccountStore();
  const productsdb = ref([]);
  const tableprods = ref(null);

  const table = ref({
    columns:[
      { name:"id", label:"ID", field:"_product", },
      { name:"description", label:"Descripcion", align:"left", field: row => row.product.description },
      { name:"code", label:"Producto", field: row => row.product.code, align:"left" },
      { name:"state", label:"Estatus", field: row => row.state.name, align:"center" },
      { name:"relateds", label:"Relacionados", field: row => row.product.relateds.length, align:"left" },
      { name:"current", label:"Actual", field:"_current", align:"center", classes: row => row._current<= 0 ? 'text-red anek-bld':'text-blue' },
      { name:"min", label:"Minimo", field:"_min", classes: row => row._max ? '':'text-red anek-bld', align:"center", },
      { name:"max", label:"Maximo", field:"_max", classes: row => row._max ? '':'text-red anek-bld', align:"center", },
      { name:"ipack", label:"PxC", field: row => row.product.pieces, classes: row => row.product.pieces ? '':'text-red anek-bld', align:"center" },
      { name:"unitrestock", label:"Un. surtido", align:"center", field: row => row.unitsupply ? row.unitsupply.name:'X', classes: row => row.unitsupply ? '':'text-red anek-bld' },
    ],
    filter:"",
    pagination:{
      rowsPerPage:30
    }
  });

  const totalRowsShow = computed(() => tableprods.value ? tableprods.value.filteredSortedRows :[]);

  onBeforeMount(() => {
    init();
  });

  const init = async () => {
    $q.loading.show({ message:"Cargando catalogo, porfavor espera" });
    const resp = await Wapi.products($route.params.wid);
    console.log(resp);
    $q.loading.hide();
    productsdb.value = resp.page.data;
  };

</script>
