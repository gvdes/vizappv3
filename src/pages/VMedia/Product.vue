<template>
  <q-page>
    <div class="text-h4 q-pa-sm row justify-end bg-white"> <ProductFinder @itemtapped="pfTapped" with-media/> </div>
    <q-separator />
    <!-- <div> -->
      <div v-if="product" class="row items-start">
        <!--
          * Producto y zona de arrastre
          -->
        <div style="max-width:350px;min-width:350px;" class="col-3 q-pa-sm" >
          <q-card>
            <div class="flex flex-center" id="imgcover" :style="bgcover"> <q-btn icon="edit" color="white" text-color="primary" round /> </div>
            <q-separator />

            <q-card-section>
              <div class="text-h4 text-grey-8 font-bold">{{ product.code }}</div>
              <div class="text-grey-8 font-semibold">{{ product.description }}</div>
              <div>CC: <span class="text-number">{{ product.short_code }}</span></div>
              <div>CB: <span class="text-number">{{ product.barcode }}</span></div>
              <div>ID: <span class="text-number">{{ product.id }}</span></div>
            </q-card-section>

            <q-separator />
            <q-uploader multiple batch flat
              color="white"
              :url="setUrl"
              :headers="headers"
              @uploading="uploadInit"
              @uploaded="uploadEnd"
              @failed="uploadFail"
              :max-files="10"
              ref="dropzoner"
              style="width:100%;"
            >
            <!-- accept="image/*,.pdf", :factory="upload" -->
              <template v-slot:list="scope">
                <div v-if="scope.files.length">
                  <q-list separator>
                    <q-item v-for="file in scope.files" :key="file.__key">
                      <q-item-section side>
                        <q-avatar size="60px" v-if="file.type=='image/png'||file.type=='image/jpg'||file.type=='image/jpeg'"><q-img :src="file.__img.src"/></q-avatar>
                        <q-avatar v-else-if="file.type=='video/mp4'" size="60px" color="purple" text-color="white" icon="smart_display"  />
                        <q-avatar v-else size="60px" flat color="secondary" text-color="white" icon="fas fa-file-lines" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ file.name }}</q-item-label>
                        <q-item-label caption>{{ file.__sizeLabel }} / {{ file.__progressLabel }}</q-item-label>
                        <q-item-label caption>{{ file.type }}</q-item-label>
                      </q-item-section>
                      <q-item-section thumbnail>
                        <template v-if="file.__status=='idle'"><q-icon name="fas fa-circle" color="warning"> <q-tooltip>en cola</q-tooltip></q-icon></template>
                        <template v-if="file.__status=='uploading'"><q-icon name="fas fa-ellipsis" color="orange-14"> <q-tooltip>en curso ...!</q-tooltip></q-icon></template>
                        <template v-if="file.__status=='uploaded'"><q-icon name="fas fa-check" color="green"> <q-tooltip>Completado!</q-tooltip></q-icon></template>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          v-if="file.__status=='idle'"
                          color="red" flat size="12px" dense round icon="close"
                          @click="scope.removeFile(file)"
                        > <q-tooltip>Quitar</q-tooltip> </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div v-else class="dropzone text-center text-grey-7 flex flex-center" style="min-height:200px;" @click="scope.pickFiles">
                  Arrastre y suelte archivos aqui (o de click aqui) para agregar archivos
                  <q-uploader-add-trigger />
                </div>
              </template>

              <template v-slot:header="scope">
                <div class="text-dark column" v-if="scope.files.length">
                  <q-btn-group flat spread>
                    <q-btn v-if="scope.queuedFiles.length" color="primary" icon="delete_sweep" @click="scope.removeQueuedFiles" rounded >
                      <q-tooltip>Quitar todos los elementos</q-tooltip>
                    </q-btn>
                    <q-btn color="primary" icon="add" @click="scope.pickFiles" >
                      <q-tooltip>Agregar mas archivos</q-tooltip>
                      <q-uploader-add-trigger />
                    </q-btn>
                    <q-btn v-if="scope.canUpload" icon="cloud_upload" @click="scope.upload" color="indigo-10" rounded >
                      <q-tooltip>Inicair subida.</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </div>
              </template>
            </q-uploader>
          </q-card>
        </div>

        <!--
          * Contenedor de Archivos actuales
          -->
        <div class="col q-pa-sm">
          <template v-if="media_actived.length">
            <q-card flat bordered>
              <q-card-section horizontal class="items-center">
                <q-card-section class="col text-h6">Archivos ({{ media_actived.length }})</q-card-section>
                <q-card-section>
                  <q-btn round dense flat icon="delete" color="red" v-if="media_recycled.length" @click="wndRecycle.state=true"> <q-tooltip>En papelera: {{ media_recycled.length }}</q-tooltip> </q-btn>
                  <q-btn flat round dense icon="more_vert" />
                </q-card-section>
              </q-card-section>
            </q-card>

            <div class="row q-gutter-lg items-start q-mt-xs">
              <q-card class="text-center media_file cursor-pointer" v-for="media in media_actived" :key="media.id">
                <q-img :src="`${$media.disks.mmedia+media.path}`" v-if="mediatypes.images.includes(media.type_file)" width="250px" />
                <q-avatar v-else-if="mediatypes.videos.includes(media.type_file)" size="250px" flat color="secondary" text-color="white" icon="play_circle" />
                <q-avatar v-else size="250px" flat color="secondary" text-color="white" icon="fas fa-file-lines" />
                <div class="media_info q-pa-sm text-white absolute-bottom">
                  <div>{{ media.name }}</div>
                </div>

                <div class="q-mb-md botonera absolute-top-right">
                  <div class="column q-gutter-sm q-pa-sm">
                    <q-btn color="white" text-color="primary" dense round icon="edit"> <q-tooltip>Editar nombre</q-tooltip> </q-btn>
                    <q-btn color="white" text-color="primary" dense round icon="link" @click="getLinkUse(media.path)"> <q-tooltip>Usar mediante link</q-tooltip> </q-btn>
                    <q-btn color="white" text-color="primary" dense round icon="download"> <q-tooltip>Descargar</q-tooltip> </q-btn>
                    <q-btn color="white" text-color="primary" dense round icon="recycling">
                      <q-tooltip>Archivar</q-tooltip>
                      <q-menu><q-btn color="red" label="Click para confirmar" @click="fileRecycle(media)" /></q-menu>
                    </q-btn>
                    <q-btn color="white" text-color="primary" dense round icon="info"> <q-tooltip>Info</q-tooltip> </q-btn>
                  </div>
                </div>
              </q-card>
            </div>
          </template>

          <template v-else>
            <q-card><q-card-section>No hay multimedia activa para este producto</q-card-section></q-card>
          </template>
        </div>
      </div>

      <div v-else class="text-center text-h5 text-grey-6 q-pa-xl q-mt-xl">busca un producto</div>

      <q-dialog v-model="wndRecycle.state">
        <q-card>
          <q-card-section>Papelera </q-card-section>
          <q-separator />
          <div class="row q-gutter-lg items-start q-mt-xs">
            <q-card class="text-center media_file cursor-pointer" v-for="media in media_recycled" :key="media.id">
              <q-img :src="`${$media.disks.mmedia+media.path}`" v-if="mediatypes.images.includes(media.type_file)" width="250px" />
              <q-avatar v-else-if="mediatypes.videos.includes(media.type_file)" size="250px" flat color="secondary" text-color="white" icon="play_circle" />
              <q-avatar v-else size="250px" flat color="secondary" text-color="white" icon="fas fa-file-lines" />
              <div class="media_info q-pa-sm text-white absolute-bottom">
                <div>{{ media.name }}</div>
              </div>

              <div class="q-mb-md botonera absolute-top-right">
                <div class="column q-gutter-sm q-pa-sm">
                  <q-btn color="white" text-color="primary" dense round icon="delete_forever"> <q-tooltip>Eliminar</q-tooltip> </q-btn>
                  <q-btn color="white" text-color="primary" dense round icon="restore_from_trash">
                    <q-tooltip>Restaurar</q-tooltip>
                    <q-menu><q-btn color="red" label="Click para confirmar" @click="fileRestore(media)" /></q-menu>
                  </q-btn>
                  <q-btn color="white" text-color="primary" dense round icon="info"> <q-tooltip>Info</q-tooltip> </q-btn>
                </div>
              </div>
            </q-card>
          </div>
        </q-card>
      </q-dialog>
    <!-- </div> -->
  </q-page>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import { useQuasar, copyToClipboard } from 'quasar';
  import VMediaAPI from 'src/API/VmediaApi';
  import ProductFinder from 'src/components/ProductFinder.vue';
  import { useMediaStore } from 'stores/Multimedia';
  import { useAccountStore } from 'stores/Account';

  const $media = useMediaStore();
  const $account = useAccountStore();
  const $q = useQuasar();

  const mediatypes = {
    images:["jpg","jpeg","png","JPG","JPEG","PNG"],
    videos:["mp4","MP4"],
  };
  const product = ref(null);
  const dropzoner = ref(null);
  const wndRecycle = ref({ state:false });

  const pfTapped = item => { product.value = item; }

  const imgcover = computed(() => product.value ? $media.disks.mmedia+product.value.picture:null);
  const headers = computed(() => [{name:'Authorization', value:`Bearer ${$account.token}`}]);
  const multimediadb = computed(() => product.value ? product.value.media : []);
  const media_actived = computed(() => multimediadb.value.filter( f => !f.deleted_at));
  const media_recycled = computed(() => multimediadb.value.filter( f => f.deleted_at));
  const bgcover = computed(() => {
    return `
      background-image:url(${imgcover.value});
      background-repeat:no-repeat;
      background-position:center center;
      background-size:cover;
      width:100%;
      height:300px;
    `;
  });

  const setUrl = files => `http://192.168.12.183/kraken/public/api/vmedia/addimages?product=${product.value.id}`;

  const uploadInit = evt => {
    console.log("Upload starting...");
    console.log(evt);
  }

  const uploadEnd = evt => {
    console.log("Upload end...");
    console.log(evt.xhr);
    const response = JSON.parse(evt.xhr.response);
    console.log(response);
    response.stored.forEach(element => {
      product.value.media.unshift(element);
    });;
    // console.log(dropzoner.value);
    dropzoner.value.reset();
  }

  const uploadFail = info => {
    console.log(info);
  }

  const getLinkUse = text => {
    let route = `${$media.disks.mmedia+text}`;

    copyToClipboard(route)
    .then(() => {
      $q.notify({
        message:"<span class='text-h6'>Copiado al portapapeles.</span>",
        icon:"done", position:"center", color:"green", html:true, timeout:1000
      });
      console.log("Copied:", route);
    })
    .catch(() => { console.log("La copia no se pudo hacer :("); });
  }

  const fileRecycle = async file => {
    const response = await VMediaAPI.recycle({file});
    file.deleted_at = response.deleted_at;
    console.log(response);
  }

  const fileRestore = async file => {
    console.log(file);
    // const response = await VMediaAPI.recycle({file});
    // file.deleted_at = response.deleted_at;
    // console.log(response);
  }
</script>


<style lang="scss">
  #imgcover {
    > button{ opacity: 0%; transition: all 300ms; }

    &:hover > button{ opacity: 100%;  }
  }

  .media_file{
    transition: all 500ms;

    .media_info{ transition: all 500ms; background: rgba(0,0,0,.4); opacity: 0;}
    .botonera{ display: none;}

    &:hover{
      z-index:1000;

      .media_info{ background: rgba(0,0,0,.8);  opacity: 1;}
      .botonera{ display: block;}
    }
  }
</style>
