<template>
  <div>
    <q-card class="my-card">
          <q-card-section>

            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-center">Semana:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ index }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Clasificacion:</q-item-label>
                  <q-item-label class="text-center text-bold">{{classifications.find(e => e.id ==
                    seman.classification).name}}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Porcentaje:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.percentage }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Puntos Asistencia: </q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.puntosAsistencia }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Puntos Checklist:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.puntosChecklist }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-section>
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-center">Turno:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.asistencia.TURNO }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Vacaciones:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.asistencia.VACACIONES }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Faltas:</q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.asistencia.FALTAS }}</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center">Retardos: </q-item-label>
                  <q-item-label class="text-center text-bold">{{ seman.asistencia.RETARDOS }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card class="my-card">
            <q-card-section>
              <q-table :rows="[seman.asistencia]" hide-bottom separator="cell" :columns="tableAssist.columns" />
            </q-card-section>
          </q-card>


          <q-card-section v-if="seman.responses.length > 0">
            <div v-for="(response, index) in seman.responses" :key="index">
              <q-list bordered>
                <q-item>
                  <q-item-section>
                    <q-item-label>Formulario</q-item-label>
                    <q-item-label>{{ response.form }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Fecha</q-item-label>
                    <q-item-label>{{ response.fecha_hora }}</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Pregunta</q-item-label>
                    <q-item-label>{{ response.question }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="response.qualified.length > 0">
                  <q-item-section>
                    <q-item-section>
                      <q-item-label>No Cumple</q-item-label>
                      <q-item-label>{{ response.qualified }}</q-item-label>
                    </q-item-section>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-section>
                      <q-item-label>Obervacion</q-item-label>
                      <q-item-label>{{ response.observacion }}</q-item-label>
                    </q-item-section>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-separator spaced inset vertical dark />
            </div>
          </q-card-section>
        </q-card>
  </div>
</template>

<script setup >
import { ref, computed } from 'vue'

const props = defineProps({
  seman: { type: Object, default: {} },
  index:{type:String, defual:0},
  classifications:{type:Array, default:[]}
})

const tableAssist = ref({
  columns: [
    // {name:'turn',label:'Turno',field: r => r.TURNO, align:'center'},s
    { name: 'sabado', label: 'Sabado', field: r => r.SABADO, align: 'center' },
    { name: 'domingo', label: 'Domingo', field: r => r.DOMINGO, align: 'center' },
    { name: 'lunes', label: 'Lunes', field: r => r.LUNES, align: 'center' },
    { name: 'martes', label: 'Martes', field: r => r.MARTES, align: 'center' },
    { name: 'miercoles', label: 'Miercoles', field: r => r.MIERCOLES, align: 'center' },
    { name: 'jueves', label: 'Jueves', field: r => r.JUEVES, align: 'center' },
    { name: 'viernes', label: 'Viernes', field: r => r.VIERNES, align: 'center' },
  ]
})
</script>
