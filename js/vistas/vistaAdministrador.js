/*
* Vista administrador
*/
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;
  var cantRespuestas = 0;

  //Suscripción de observadores: la vista se suscribe a los eventos del modelo para que sea notificada de los cambios
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntasBorradas.suscribir(function() {
    contexto.reconstruirLista();
  });
};


VistaAdministrador.prototype = {
  inicializar: function() {
    //Se llama a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem = $('<li>', {
      class: "list-group-item",
      id: pregunta.id,
      text: pregunta.textoPregunta
    });
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //Se asocia los eventos a los botones
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];

      $('[name="option[]"]').each(function() {
        var respuesta = $(this).val();
        if(respuesta.length>0){
          respuestas.push({
            'textoRespuesta': respuesta,
            'cantidad': 0
          });
        }
      })
      contexto.limpiarFormulario();
      //La Vista le avisa al controlador que se clickeo el boton agregar pregunta
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    e.botonBorrarPregunta.click(function() {
      contexto.controlador.borrarPregunta()
    });
    e.botonEditarPregunta.click(function() {
      contexto.controlador.modificarPregunta()
    });
    //Borra todas las preguntas a la vez
    e.borrarTodo.click(function() {
      contexto.modelo.borrarPreguntas()
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
