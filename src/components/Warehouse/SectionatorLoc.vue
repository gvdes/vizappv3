<template>
  <q-card class="my-card">
     <!--
      <q-card-section>root:{{root}} deep:{{ deep }} idwrh:{{wrh.id}}</q-card-section>
      <q-card-section>Seccion:{{sectiondb}}</q-card-section>
      <q-card-section>{{ sectionsdb.length }}</q-card-section>
      <q-card-section>{{isnewgroup}}</q-card-section>
      <q-card-section> {{ piniaWrh.$state }} </q-card-section>
      <q-card-section>{{groups}}</q-card-section>
    -->

    <q-card-section>Seccionar</q-card-section>
    <q-separator/>
    <q-form @submit="create">
      <q-card-section>
        <template v-if="groups.length">
          <q-select
            autofocus rounded
            label="Grupo"
            v-model="group"
            :options="groups"
            option-value="alias"
            @update:model-value="setGroup"
          >
          </q-select>
        </template>

        <q-input rounded :disable="!isnewgroup" input-class="text-uppercase" v-model="name" label="Nombre" />
        <q-input rounded :disable="!isnewgroup" input-class="text-uppercase" v-model="alias" label="Alias" />
        <q-input rounded v-model="siblings" label="Elementos" type="number" min="1" max="50"/>
      </q-card-section>

      <template v-if="showbtnadd">
        <div v-if="isnewgroup" class="q-pa-md">
          <div v-if="siblings==1">Se agregara el Grupo/Seccion <span class="text-orange-14 text-uppercase">{{name}} ({{alias}})</span></div>
          <div v-else>
            <div>Se creara el grupo <span class="text-orange-14 text-uppercase">{{name}} ({{alias}})</span></div>
            <div>Se agregaran <span class="text-orange-14">{{prepath.add}}</span> secciones:</div>
            <div class="row items-center">
              <span class="text-orange-14 text-uppercase q-pr-xs">{{name}} {{prepath.ini}} ({{alias}}{{prepath.ini}})</span>
              <q-icon name="fas fa-chevron-right"/>
              <span class="text-orange-14 text-uppercase q-pl-xs">{{name}} {{prepath.end}} ({{alias}}{{prepath.end}})</span>
            </div>
          </div>
        </div>

        <div v-else class="q-pa-md">
          <div v-if="siblings==1">Se agregara la seccion <span class="text-orange-14">{{prepath.g.name}} {{prepath.end}} ({{prepath.g.alias}}{{prepath.end}})</span> al grupo <span class="text-orange-14">{{prepath.g.label}}</span></div>
          <div v-else>
            <div>Se agregaran <span class="text-orange-14">{{prepath.add}}</span> secciones al grupo <span class="text-orange-14">{{prepath.g.label}}</span></div>
            <div class="row items-center">
              <span class="text-orange-14 q-pr-xs">{{prepath.g.name}} {{prepath.ini}} ({{prepath.g.alias}}{{prepath.ini}})</span>
              <q-icon name="fas fa-chevron-right"/>
              <span class="text-orange-14 q-pl-xs">{{prepath.g.name}} {{prepath.end}} ({{prepath.g.alias}}{{prepath.end}})</span>
            </div>
          </div>
        </div>

        <q-btn type="sumbit" color="primary" class="full-width q-py-md" label="crear" icon="done" :disable="btnsubmit.state" :loading="btnsubmit.state"/>
      </template>
    </q-form>
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useWarehouseStore } from 'stores/Warehouse';

  const piniaWrh = useWarehouseStore();

  const props = defineProps({
    sections:{type:Array,default:[]}
  });

  const sectionsdb = props.sections;
  const group = ref({alias:null,group:null,label:"--"});
  const alias = ref(null);
  const name = ref(null);
  const siblings = ref(1);
  const btnsubmit = ref({ state:false });

  const $emit = defineEmits(["add"]);

  const showbtnadd = computed(()=> name.value&&alias.value&&siblings.value );

  const groups = computed(()=>{
    if(sectionsdb.length){
      let _grs = [{ alias:null, group:null, label:"--" }];

      sectionsdb.forEach( g => {
        let split = g._group.split(',');
        let name=split[0], alias=split[1], label=`${name} (${alias})`;
        if( !_grs.find( _g => (_g.alias==alias&&_g.name==name) ) ){ _grs.push({alias,name,label,rawgroup:g._group}) }
      });

      return _grs;
    }else{ return []; }
  });

  const isnewgroup = computed(() => !group.value.alias);
  const root = computed(() => piniaWrh.location ? piniaWrh.location.id:0 );
  const deep = computed(() => piniaWrh.location ? piniaWrh.location.deep:0 );

  const prepath = computed(()=>{
    if(showbtnadd.value){
        let g = group.value;
        let csiblings = parseInt(sectionsdb.filter( section => section._group == g.rawgroup ).length);
        let ini = parseInt(csiblings+1);
        let add = parseInt(siblings.value);
        let end = parseInt(csiblings+add);
        return {g,csiblings,ini,add,end};
    } return null;
  });

  const setGroup = (v)=>{
    if(v.alias){ alias.value=v.alias; name.value=v.name; }else{ alias.value=null; name.value=null; }
  }

  const create = () => {
    btnsubmit.value.state = true;

    const data = {
      group: group.value.alias ? group.value:null,
      name: name.value.toUpperCase(),
      alias: alias.value.toUpperCase(),
      siblings: siblings.value,
      root: root.value,
      deep: deep.value
    }

    $emit("add",data);
  }
</script>
