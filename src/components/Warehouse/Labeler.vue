<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="text-h6">Almacen - Generador de etiquetas</div>
      <div class="text-subtitle2">Etiquetas: {{ totLabRend }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-select v-model="labelOtt" :options="[{id:'h', label:'Horizontal'}, {id:'v', label:'Vertical'}]" label="Formato" filled />
    </q-card-section>
    <q-card-section>
      <div>Etiquetas por pagina: {{ labelsPerPage }}</div>
      <div>Columnas: {{ cols }}</div>
      <div>Filas: {{ rows }}</div>
      <div class="text-bold">Hojas: {{ totPagesDoc }}</div>
    </q-card-section>

    <!-- <q-card-section>
      <div>Documento:</div>
      <div>Dimensiones (espacio disponible): {{ maxPageW }} x {{ maxPageH }}</div>
      <div>Dimensiones de eiqueta (celda): {{ maxCellW }} x {{ maxCellH }}</div>
    </q-card-section> -->
    <q-card-actions align="right">
      <q-btn label="Generar" color="primary" @click="render"/>
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import jsPDF from 'jspdf'
  import QRCode from 'qrcode';
  import { useAccountStore } from 'src/stores/Account';
  import dayjs from 'dayjs';

  const $acc = useAccountStore();
  const ownerdoc = `${$acc.account.name} ${$acc.account.surnames} (${$acc.account.nick}) | ${$acc.joinedStore.alias}`;

  const $props = defineProps({
    location:null,
    sections:{type:Array, default:[]}
  });

  const $emit = defineEmits(["doit"]);

  const totLabRend = $props.sections.length; // tamaño total de etiquetas a renderizar
  let labelOtt = ref({id:'h', label:'Horizontal'});// orientacion de la etiqueta
  let cols = computed(() => labelOtt.value.id == "h" ? 2:4); // define el numero de columnas en base a la orientacion de la etiqueta
  let rows = computed(() => labelOtt.value.id == "h" ? 8:3); // define el numero de filas en base a la orientacion de la etiqueta
  let labelsPerPage = computed(() => (cols.value*rows.value)); // calcula el numero de etiquetas por pagina en base a las filas y columnas
  let totPagesDoc = computed(() => Math.ceil(totLabRend/labelsPerPage.value));// calcula el numero total de paginas en base a las etiquetas por pagina
  const paddpage = 10; // padding/margen de la hoja (en mm)
  const footerFontSize = 10; // tamaño de la fuente para el footer (importante para el espacio disponiblede la hoja)
  const gridColor = "#ced6e0"; // color del grid de la hoja
  let maxPageW = ref(0); // ancho maximo de la hoja (espacio maximo disponible a lo ancho)
  let maxPageH = ref(0); // alto maximo de la hoja (espacio maximo disponible a lo alto)
  let maxCellW = ref(0); // ancho maximo de la celda
  let maxCellH = ref(0); // alto maximo de la celda

  watch($props.sections, (newVal, oldVal) => { $props.sections = newVal });

  const render = async () => {

    let $doc = new jsPDF();
    console.log($doc);
    let pageDims = $doc.internal.pageSize; // obtenemos las dimensiones de la pagina (altura, anchura)
    maxPageW.value = Math.floor(pageDims.getWidth()-paddpage); // Max Page Width (configura el ancho maximo de la hoja)
    maxPageH.value = Math.floor(pageDims.getHeight()-(paddpage+footerFontSize)); // Max Page Height (configura el alto maximo de la hoja)
    maxCellW.value = (maxPageW.value-paddpage)/cols.value; // alto maximo de celda (configura el ancho maximo de la etiqueta)
    maxCellH.value = (maxPageH.value-paddpage)/rows.value; // ancho maximo de celda (configura el alto maximo de la etiqueta)

    let chunks = chunksBuilder(); // obtenemos los arreglos con las etiquetas que se insertaran en cada pagina

    // console.log("Generando documento: ", cols.value, "X", rows.value, "=>", labelsPerPage.value)
    // dibujamos la primer pagina (que genera por default la clase new jspdf();), agregando el grid, el margen y las etiquetas que le corresponden a la hoja
    await drawLabelsPage($doc, chunks[0], 0, false);

    /** agregamos el resto de las paginas, con sus respectiovas etiquetas */
    for (let page = 1; page < totPagesDoc.value; page++) {
      await drawLabelsPage($doc, chunks[page], page);
    }

    let now = dayjs().format("HHmmss");
    let docname = `labels_O${labelOtt.value.id.toUpperCase()}_${now}.pdf`; // nombre del documento a generar/auto_descargar

    $doc.save(docname); // generamos y descargamos el documento
    $emit("doit",docname);
  }

  const drawGridPage = $doc => { // dibuja el grid (cuadricula/guia de corte) a la hoja
    $doc.setDrawColor(gridColor);
    $doc.rect(paddpage,paddpage, (maxPageW.value-paddpage), (maxPageH.value-paddpage));

    // generando grid vertical
    let cell_ejex = (paddpage+maxCellW.value);
    for (let vline = 1; vline < cols.value; vline++) {
      $doc.line(cell_ejex,paddpage, cell_ejex,maxPageH.value);
      cell_ejex += maxCellW.value;
    }
    cell_ejex = (paddpage+maxCellW.value);

    // dibujar grid horizontal
    let cell_ejey = (paddpage+maxCellH.value);
    for (let hline = 1; hline < rows.value; hline++) {
      $doc.line(paddpage, cell_ejey, maxPageW.value, cell_ejey);
      cell_ejey+=maxCellH.value
    }
    cell_ejey = (paddpage+maxCellH.value);

    $doc.setDrawColor("#000000");
  }

  const drawFooter = ($doc,npage) => { // dibuja el footer de la pagina
    /**
     * Incluye el usuario que genero el documento y la gui de paginas
     */
    let text = `${ownerdoc} | [ ${npage} de ${totPagesDoc.value} ]`;

    $doc.setFontSize(footerFontSize);
    $doc.setTextColor(128, 142, 155);
    $doc.text(text, (maxPageW.value/2), (maxPageH.value+footerFontSize), {align:"center"});
    $doc.setTextColor(0,0,0);
    $doc.setFontSize(16);
  }

  const drawLabelsPage = async ($doc, chunks, npage, addpage=true) => {
    npage++;
    addpage ? $doc.addPage() : $doc.setPage(npage);

    drawGridPage($doc); // grid para la pagina

    let cell_ejex = paddpage; // coordenada X inicial de la celda
    let cell_ejey = paddpage; // coordena Y inicial de la celda
    let cell_page = 1; // numero de celda en la pagina
    let row_page = 1; // numero de fila en la pagina
    let cell_row = 1; // numero de celda en la fila
    let breakRow = cols.value; // quiebre o salto de fila
    let _mps = 2; // main padding sections

    // en base a la orientacion de la etiqueta; configuramos y obtenemos las dimensiones de la etiqueta (anchura y altura de las secciones datos / codigo QR)
    let { sdt, sqr } = sectionsLabelsDimensions();
    /**
     * Propiedades para la seccion del QR
     *  > whqr: generamos ancho y alto del codigo QR (se le resta el padding para poder centrarlo)
     *    > Obtenemos el ancho y el alto de la seccion del QR (sqr.w y sqr.h) para tomar valor mas pequeño
     *    > Este valor (whqr) representara la medida con la generaremos el alto y ancho del codigo QR (para que siempre sea cuadrado)
     *  > posqr: calcula las
     */
    let whqr = (sqr.h > sqr.w) ? (sqr.w-_mps) : (sqr.h-_mps);
    let posqr = { x:((sqr.w-whqr)/2), y:((sqr.h-whqr)/2) };

    // iteramos las "ubicaciones" correspondientes a la pagina actual para generar cada etiqueta
    for (const section of chunks) {
      let idstringed = String(section.id); // parseamos a texto el id de la ubicacion (para poder incluirlo en el codigo qr)
      /**
       * Para ver las propiedades de la celdas y filas en el pdf: utiliza las siguientes lineas
       * (alias/valores ==> RP: RowPage, RC: RowCell, CIP: Cell In Page, WSD: Width Section Data, WSQR: Width Section QR)
       */
      // $doc.setFontSize(8);
      // let descDimCell = `RP: ${row_page} | RC: ${cell_row} | CIP: ${cell_page} | WSD: ${sdt.w}, ${sdt.h} | WSQR: ${sqr.w}, ${sqr.h} | MCW: ${maxCellW.value} | ademas quisiera escribir mas texto brother`;
      // $doc.text(descDimCell,);

      /**
       * ======== Dibujando Seccion de los Datos ========
       */
      let lsdp = sectionDataProps(cell_ejex,cell_ejey,sdt,sqr,_mps,{idloc:idstringed,path:section.path}); // Location Section Props (calcula la ubicacion via coordenadas de la seccion de los datos (id ubicacion, ubicacion), opcionalemnte la dibuja al pasar el parametro $doc)
      $doc.setFontSize(parseFloat(lsdp.loc.fsz));
      $doc.text(section.path, lsdp.loc.x, lsdp.loc.y, {baseline:"bottom", align:"center"}); // centramos abajo la el path de la ubicacion

      $doc.setFontSize(parseFloat(lsdp.idl.fsz));
      $doc.text(idstringed, lsdp.idl.x, lsdp.idl.y, {baseline:"middle", align:"center"}); // centramos en X y Y el id de la ubicacion

      /**
       * ======== Dibujando Seccion del QR ========
       */
      // Location Section QR (calcula la ubicacion via coordenadas de la seccion del QR, opcionalemnte la dibuja al pasar el parametro $doc)
      let lsqr = sectionQRProps(cell_ejex,cell_ejey,sdt,sqr);
      let imgQR = await QRCode.toDataURL(idstringed,{margin:1});// generamos el codigo QR
      $doc.addImage(imgQR,"JPEG",(lsqr.x+posqr.x),(lsqr.y+posqr.y),whqr,whqr); // dibujamos el sodigo QR (adicionamos las coordenadas "X" y "Y" del "lsqr" para centrar el codigo QR)

      // las siguientes lineas calculan la posicion de las filas, celdas
      if(cell_row == breakRow){// preguntamos si ya hemos llenado todas las celdas de la fila para continuar en el principio de la siguiente fila
        row_page++; // incrementamos la fila de la pagina
        cell_row = 1; // reseteamos la posicion de la celda de la fila
        cell_ejey += maxCellH.value; // desplazamiento en el eje "Y" para la siguiente fila (pasamos a la siguiente fila)
        cell_ejex = paddpage;// desplazamiento en el eje "X" al inicio de la fila

      }else{// si no tenemos un quiebre de fila (salto de linea/fila) se configuran valores, para moverse a la siguiente celda
        cell_row++; // incrementamos el valor de la celda de en la fila actual
        cell_ejex += maxCellW.value;// nos movemos vamos a la siguiente celda a la derecha
      }

      cell_page++; // en cada vuelta, se incrmenta el numero de celda/etiqueta
    }
    $doc.setFontSize(16);

    drawFooter($doc,npage);
  }

  const sectionsLabelsDimensions = () => { // calcula las dimensiones de las secciones principales de la etiqueta (seccion de datos y seccion de Codigo QR)
    /**
     * Dimensiona en base a la orientacion de la etiqueta
    */

    let sdt = { w:0, h:0, ct:0 }; // Section Data dimensions (w:width, h:heigth, ct:center-top)
    let sqr = { w:0, h:0, ct:0 }; // section QR Dimensions (w:width, h:heigth, ct:center-top)

    if (labelOtt.value.id == "h"){
      sdt.w = (0.65*maxCellW.value); // set Width Section Data
      sdt.h = maxCellH.value; // set Height Section Data

      sqr.w = (maxCellW.value-sdt.w); // set With Section QR
      sqr.h = maxCellH.value; // set Height Section QR
    }else{
      sdt.w = maxCellW.value; // Width Section Data
      sdt.h = (0.55*maxCellH.value); // Height Section Data

      sqr.w = maxCellW.value; // With Section QR
      sqr.h = (maxCellH.value-sdt.h); // Height section QR
    }

    sdt.ct = (sdt.w/2); // set center top section data
    sqr.ct = (sqr.w/2); // set center top section QR

    return ({ sdt, sqr })
  }

  const sectionQRProps = (cx,cy,sdt,sqr,$doc=null) => { // calcula la ubicacion de la seccion del QR (opcionalemente dibuja el grid)
    /**
     * retorna las coordenadas en las que inicia la seccion del codigo QR y las propiedades para la imagen del QR
     * (opcionalemente dibuja el grid cuando se pasa el ultimo parametro "$doc" ==> instancia al documento pdf)
     */
    let qrprops = labelOtt.value.id == "h" ? ({ x:(cx+sdt.w), y:cy }) : ({ x:cx, y:(cy+sdt.h) }) ; // Location Section QR

    if ($doc) {// dibujamos el grid de la seccion del QR
      $doc.setDrawColor("#ff4757");
      $doc.rect(qrprops.x, qrprops.y, sqr.w, sqr.h); // desplazamiento de section QR
    }

    return qrprops;
  }

  const sectionDataProps = (cx,cy,sdt,sqr,_mps,dts,$doc=null) => {
    // $doc.setFontSize(16);
    /** Calcula las dimensiones de las subsecciones de la seccion datos (id ubicacion, ubicacion) */
    let w = (sdt.w-_mps); // calculamos el ancho del contenedor de las subsecciones de los datos
    let h = (sdt.h-_mps); // calculamos el ancho del contenedor de las subsecciones de los datos
    let x = (cx+(_mps/2)+(w/2));
    let { idloc, path } = dts; // destructuramos los datos que se incluiran en la subseccion datos (id ubicacion, path de la ubicacion)

    let dtprops = {
      loc:{ w, h, x, y:(cy+h), fsz:18 },
      idl:{ w, h, x, y:(cy+(h/2)), fsz:40 }
    }

    if($doc){ // dibujamos grid de la seccion de los datos
      $doc.setDrawColor("#1e90ff");
      $doc.rect(cx, cy, sdt.w, sdt.h); // dibujamos el contenedor principal
      $doc.setDrawColor("#ff6b81");
      // let pathdims = $doc.getTextDimensions(path);
    }

    return dtprops
  }

  const chunksBuilder = () => {
    /**
     * Retorna un arreglo de arreglos que contiene las etiquetas que dibujara por hoja
    */
    const chunks = [];

    for (let label = 0; label < $props.sections.length; label += labelsPerPage.value) {
      chunks.push($props.sections.slice(label, (label+labelsPerPage.value)));
    }

    return chunks;
  }

</script>
