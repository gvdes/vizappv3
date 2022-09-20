<template>

  <template v-if="submodules.length">
    <q-expansion-item
      expand-separator
      expand-icon-toggle
      expand-icon="fas fa-caret-down"
      expand-icon-class="text-secondary"
      switch-toggle-side
      header-class="goto"
    >
      <template v-slot:header>
        <q-item-section @click="goto" v-ripple>
          <div class="row items-center justify-between">
            <div>{{module.name}}</div>
            <div><q-icon name="fas fa-angle-right" color="grey-6" size="15px"/></div>
          </div>
          <!-- <q-item-label caption lines="2">Secondary line text.</q-item-label> -->
        </q-item-section>
      </template>

      <q-list>
        <BranchModule  v-for="(module) in submodules" :key="module.id" :module="module" />
      </q-list>
    </q-expansion-item>
  </template>

  <template v-else>
    <q-item clickable v-ripple @click="goto">
      <q-item-section>
        <q-item-label>{{ module.name }}</q-item-label>
        <!-- <q-item-label caption lines="2">Secondary line text.</q-item-label> -->
      </q-item-section>
      <q-item-section avatar>
        <q-icon name="fas fa-angle-right" color="grey-6" size="15px"/>
      </q-item-section>
    </q-item>
  </template>
</template>

<script setup>
  import { ref, watch, onBeforeMount, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useQuasar } from 'quasar';
  import { useAccountStore } from 'stores/Account';

  const $router = useRouter();
  const piniaAccount = useAccountStore();

  const props = defineProps({
    module:{type:Object,default:{} },
  });

  const module = props.module;
  const expanded = ref(false);

  const submodules = computed(() => piniaAccount.submodulesOf(module.id).map( m => m.module) );

  const goto = () => {
    let store = piniaAccount.join;
    $router.replace(`/store/${store}/${module.path}`);
    console.log(module.path);
  }

</script>

<style lang="scss" scope>
  .goto{
    transition: all 200ms;
    &:hover{
      cursor:pointer;
      background: rgba(0,0,0,.09);
    }
  }
</style>
