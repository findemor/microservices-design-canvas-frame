
  const DOMAIN = "https://findemor.github.io/microservices-design-canvas-frame/";

  //show error helper
  function showError({ desc, message }) {
    if (desc && message) {
      $( "#error").show({});
      $( "#error-desc").text(desc);
      $( "#error-message").text(message);
    } else {
      $( "#error").hide();
    }
  }

  //get json schema
  $.getJSON(DOMAIN + "/specs/schema.json", (schema) => {
    
    $('#urlInput').on('input', function() {
      onURLInput($(this).val());
    });
    $('#jsonInput').on('input', function() {
      onJSONInput($(this).val());
    });

    //evaluate and print canvas
    function evaluate({ json, url, schema }) {
      let validation = tv4.validateResult(json, schema);
      if (validation.valid || !json) {
        showError({});
        let base64json = window.btoa(JSON.stringify(json));        
        $( "iframe" ).attr('src', `html/iframe?base64json=${base64json}`);
        setupShareModal({ base64json, url });        
      } else {
        showError({ desc: "There are some Json validation errors", message: validation.error.message });
      }
    }

    function setupShareModal({ url, base64json }) {
        //Preparamos la caja de compartir
        if (base64json) {
          $( "#shareEmbed" ).val(`<iframe src="${DOMAIN}html/iframe?base64json=${base64json}"></iframe>`);
          $( "#CopyShareURL" ).prop('disabled', false);
        } else {
          $( "#CopyShareURL" ).prop('disabled', true);
        }

        if (url) {
          $( "#shareURL" ).val(`<iframe src="${DOMAIN}html/iframe?url=${url}"></iframe>`);
          $( "#CopyShareEmbed" ).prop('disabled', false);
        } else {
          $( "#CopyShareEmbed" ).prop('disabled', true);
        }
    }


      
    loadExamples();

    function loadExamples() {
      $("#loadExample").click(function() {
        let url = `${DOMAIN}specs/example.json`;
        $("#urlInput").val(url);
        onURLInput(url);
      });
    }

    function onURLInput(url) {   

      $.getJSON(url, function(data) {
      })
      .done(function(json) { 
        showError({});
        $( "#jsonInput" ).val(JSON.stringify(json, null, 4));
        evaluate({ json, url, schema });
      })
      .fail(function(jqXHR, textStatus, errorThrown) { 
        showError({ desc: "Invalid MDC Json URL", message: textStatus });
      })
      //.always(function() { console.log('getJSON request ended!'); });
    }

    function onJSONInput(json) {
      evaluate({ json, schema });
    }
    });