//https://learn.jquery.com/plugins/basic-plugin-creation/
(function( $ ) {
 
  $.fn.mdc = function(options) {
    let settings = $.extend({
      url: null,
      json: null,
    }, options );

    //get json spec
    if (settings.url) {
      $.getJSON(settings.url, ( data ) => {
        processContent({ container: this, json: data });  
      });
    } else if (settings.json) {
      processContent({ container: this, json: settings.json });
    } else {
      console.log("options url or json must be specified");
    }

    //process content
    function processContent({ container, json }) {
      container.text(JSON.stringify(json));
    }   

    //chaining
    return this;
  };

}( jQuery ));

//favicons https://www.google.com/s2/favicons?domain=https://www.solusoft.es