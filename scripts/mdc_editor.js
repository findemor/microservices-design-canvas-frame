
  //const DOMAIN = "https://findemor.github.io/microservices-design-canvas-frame/";
  //const HOST = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
  //const DOMAIN = window.location.href;
  const DOMAIN = "http://localhost/";


  //get variables from url
  var param_json = null;
  var param_url = null;

  function getUrlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
    return (results !== null) ? results[1] || 0 : false;
  }

  //if base64json exist, it is supposed to be a base64 mdc json encoded file
  let encoded_json = getUrlParam("base64json");
  if (encoded_json) {
    param_json = JSON.parse(window.atob(encoded_json));
  };
  param_url = getUrlParam("url");


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
  $.getJSON(DOMAIN + "specs/schema.json", (schema) => {

    /* editor */
    const template = {
      "mdcf": "1.0.0",
      "id": "",
      "url": "",
      "name": "",
      "description": "",
      "capabilities": [ ],
      "implementation": {
        "qualities": [],
        "logic": [],
        "data": []
      },
      "dependencies": {
        "serviceDependencies": [],
        "eventsSubscriptions": []
      },
      "interface": {
        "queries": [],
        "commands": [],
        "eventsPublished": []
      }
    };

    // create the editor
    const container = document.getElementById("jsonInput");
    //https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
    const options = {
      onChangeJSON: onJSONInput
    };
    const editor = new JSONEditor(container, options);
    editor.set(template);
    /* end editor */

    //evaluate url on load
    if (param_url) onURLInput(param_url);
    if (param_json) {
      onJSONInput(param_json);
      editor.set(param_json);
    }

    //evaluate and print canvas
    function evaluate({ json, url, schema }) {
      try {
        showError({});
        if ($.type(json) === "string") json = JSON.parse(json);
        let validation = tv4.validateResult(json, schema);
        if (validation.valid || !json) {
          let base64json = window.btoa(JSON.stringify(json));        
          $( "#mdc_iframe" ).attr('src', `html/iframe.html?base64json=${base64json}`);
          setupShareModal({ base64json, url });        
        } else {
          throw Error(validation.error.message);
        }
      } catch (message) {
        showError({ desc: "There are some Json validation errors", message });
      }
    }

    function setupShareModal({ url, base64json }) {
        //Preparamos la caja de compartir
        if (base64json) {
          //iframe
          $( "#shareEmbed" ).val(`<iframe src="${DOMAIN}html/iframe.html?base64json=${base64json}"></iframe>`);
          $( "#CopyShareEmbed" ).prop('disabled', false);
          //link
          $( "#shareLinkEmbed" ).val(`${DOMAIN}html/iframe.html?base64json=${base64json}`);
          $( "#CopyShareLinkEmbed" ).prop('disabled', false);
        } else {
          $( "#CopyShareEmbed" ).prop('disabled', true);
          $( "#CopyShareLinkEmbed" ).prop('disabled', true);
        }

        if (url) {
          //iframe
          $( "#shareURL" ).val(`<iframe src="${DOMAIN}html/iframe.html?url=${url}"></iframe>`);
          $( "#CopyShareURL" ).prop('disabled', false);
          //link
          $( "#shareLinkURL" ).val(`${DOMAIN}html/iframe.html?url=${url}`);
          $( "#CopyShareLinkURL" ).prop('disabled', false);
        } else {
          $( "#CopyShareURL" ).prop('disabled', true);
          $( "#CopyShareLinkURL" ).prop('disabled', true);
        }
    }


      
    setupUrlButtons();
    setupShareButtons();

    function setupUrlButtons() {
      $("#reloadUrl").click(function() {
        onURLInput($("#urlInput").val());
      });

      $("#loadExample").click(function() {
        let url = `${DOMAIN}specs/example.json`;
        $("#urlInput").val(url);
        onURLInput(url);
      });

      $("#onURLInput").click(function() {
        onURLInput($("#urlInput").val());
      });
    }

    
    function setupShareButtons() {
      $( "#CopyShareEmbed" ).click(function() {
        $( "#shareEmbed" ).select();
        document.execCommand("copy");
      });

      $( "#CopyShareURL" ).click(function() {
        $( "#shareURL" ).select();
        document.execCommand("copy");
      });

      $( "#CopyShareLinkEmbed" ).click(function() {
        $( "#shareLinkEmbed" ).select();
        document.execCommand("copy");
      });

      $( "#CopyShareLinkURL" ).click(function() {
        $( "#shareLinkURL" ).select();
        document.execCommand("copy");
      });
    }

    function onURLInput(url) {   

      $.getJSON(url, function(data) {
      })
      .done(function(json) { 
        showError({});
        editor.set(json);
        //$( "#jsonInput" ).val(JSON.stringify(json, null, 4));
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