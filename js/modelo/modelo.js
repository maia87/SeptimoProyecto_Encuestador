/*
* Modelo
*/
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de los eventos que el modelo le va a notificar luego a las vistas
  this.preguntaAgregada = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasBorradas = new Evento(this);
  this.votoAgregado = new Evento(this);

  this.verificarLocalStorage();
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    var maxId = -1;
    for(var i=0;i<this.preguntas.length;++i){
      if(this.preguntas[i].id > maxId)
      maxId = this.preguntas[i].id;
    }
    return maxId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },
  editarPregunta: function(id, nuevaPregunta) {
    var preguntaAReemplazar = this.obtenerPregunta(id);
    preguntaAReemplazar.textoPregunta = nuevaPregunta;

    var preguntaAModificar = this.preguntas.splice(this.preguntas.indexOf(this.obtenerPregunta(id)), 1, preguntaAReemplazar);
    this.guardar();
    this.preguntaEditada.notificar();
  },

  obtenerPregunta: function(valor){
    var identificador;
    if(typeof valor == 'number'){
      identificador = 'id';
    }
    else{
      identificador = 'textoPregunta'
    }
    for(var i=0;i<this.preguntas.length;++i){
      if(this.preguntas[i][identificador] === valor){
        return this.preguntas[i];
      }
    }
    throw new Error("La pregunta no está definida");
  },

  borrarPregunta: function(id) {
    this.preguntas = this.preguntas.filter(function(pregunta) { return pregunta.id != id; });
    this.guardar();
    this.preguntaEliminada.notificar();
  },

  borrarPreguntas: function() {
    this.preguntas = [];
    this.reiniciarLocalStorage();
    this.preguntasBorradas.notificar();
  },

  agregarVoto: function(pregunta, respuesta) {
    for(var i=0; i<pregunta.cantidadPorRespuesta.length;++i){
      if (pregunta.cantidadPorRespuesta[i].textoRespuesta === respuesta) {
        var indicePregunta = -1;
        for(var j=0; j<this.preguntas.length; ++j){
          if(this.preguntas[j].textoPregunta === pregunta.textoPregunta){
            indicePregunta = j;
          }
        }
        pregunta.cantidadPorRespuesta[i].cantidad += 1;
        this.preguntas.splice(indicePregunta, 1, pregunta);
      }
    }
    this.guardar();
    this.votoAgregado.notificar();
  },

  //Se incorpora LocalStorage para que las preguntas, respuestas y votos se guarden localmente.
  verificarLocalStorage: function(){
    if (localStorage.getItem('preguntas') !== null) {
      this.preguntas = JSON.parse(localStorage.getItem('preguntas'));
    }
  },

  reiniciarLocalStorage: function(){
    localStorage.setItem('preguntas', JSON.stringify([]));
  },

  //Se guardan las preguntas
  guardar: function(){
    localStorage.setItem('preguntas', JSON.stringify(this.preguntas));
  },
};
