<template>
  <q-card class="my-card">
    <q-card-section>Seccionar</q-card-section>
      <!--
        <q-card-section>root:{{root}} deep:{{ deep }} idwrh:{{wrh.id}}</q-card-section>
        <q-card-section>Seccion:{{sectiondb}}</q-card-section>
        <q-card-section>{{ sectionsdb.length }}</q-card-section>
        <q-card-section>{{groups}}</q-card-section>
        <q-separator/>
      -->
    <q-separator />

    qcard
  </q-card>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const props = defineProps({
    wrh:null,
    section:null,
    groups:{type:Array,default:[]}
  });

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
  const root = computed(() => { return sectiondb ? sectiondb.id:0 });
  const deep = computed(() => { return sectiondb ? sectiondb.deep:0 });

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
    const data = {
      idwrh:wrh.id,
      group:group.value.alias ? group.value:null,
      name: name.value.toUpperCase(),
      alias: alias.value.toUpperCase(),
      siblings:siblings.value,
      root:root.value, deep:deep.value
    }

    $emit("add",data);
  }
</script>
