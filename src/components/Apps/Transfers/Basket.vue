<template>
  <div class="row q-gutter-md">
    <q-card flat bordered v-for="(line, index) in basket" :key="index" >
      <q-card-section>
        <div class="col row items-end justify-between">
          <div class="text-h6">{{ line.product.code }}</div>
          <div>{{ line.product.id }}</div>
        </div>
        <div class="col row justify-between">
          <div>{{ line.product.short_code }}</div>
          <div>{{ line.product.barcode }}</div>
        </div>
      </q-card-section>
      <q-card-section>{{ line.product.description }}</q-card-section>
      <q-card-section>
        <q-chip color="grey-3">
          <q-avatar><q-icon name="fas fa-box" color="primary" /></q-avatar> {{ line.amount }}
        </q-chip>

        <q-chip color="grey-3">
          <q-avatar><q-icon name="fas fa-user" color="primary" /></q-avatar> {{ line.addby.nick }}
        </q-chip>

        <q-chip color="grey-3">
          <q-avatar><q-icon name="fas fa-clock" color="primary" /></q-avatar> {{ $date.formatDate(line.created_at, 'MMM DD, YYYY') }}
        </q-chip>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const $props = defineProps({
  basket:{type:Array, default:[]},
  grid:false,
  date:{},
  user:{},
  state:{}
});

const $emit = defineEmits(["lineTapp"]);

const basket = ref($props.basket);
const $date = ref($props.date);
const $user = ref($props.user);
const state = ref($props.state);

const uAdmin = computed(() => [1,9,10].includes($user.value.rol.id));

// const tappLine = line => (
//     (state.value.id==1 && line._user==$user.value.id) ||
//     (state.value.id<=2 && uAdmin.value)
//   ) ? $emit("lineTapp", line) : null;

watch(()=>$props.basket, list => basket.value = list );
</script>

<style lang="scss" scope>
.mwp{
  border-radius: 10px;
}
</style>
