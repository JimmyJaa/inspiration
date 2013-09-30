$(window).load(function() {
  $(document).foundation();
  $('#container').isotope({ itemSelector : '.item' });
  // $('#container').isotope('shuffle');

  // http://stackoverflow.com/questions/7270947/rails-3-1-csrf-ignored
  $.ajaxSetup({
    beforeSend: function(xhr) {
                  xhr.setRequestHeader('X-CSRF-Token',
                    $('meta[name="csrf-token"]').attr('content'));
                }
  });

  // http://api.jquery.com/jQuery.when/
  var requests = [];

  $('.embed').each(function(index, value) {
    var url = $(value).data('embed');

    var dribbble_re = /http\:\/\/dribbble\.com\/shots\//;
    var deviant_re = /deviantart\.com/
    var flickr_re = /www\.flickr\.com/
    var request;

    if (dribbble_re.test(url)) {
      var oembed_url = 'http://api.dribbble.com/shots/' + url.replace(dribbble_re, "") + '?callback=?';
      request = $.getJSON(oembed_url, function(data) {
        images = data;
      }).done(function() {
        var a = $('<a>');
        var img = $('<img class="dribbble">');

        var title = '"' + images.title + '" by ' + images.player.name;

        if (images.image_400_url != undefined) {
          img.attr('src', images.image_400_url);
        } else {
          img.attr('src', images.image_teaser_url);
        }
        img.attr('alt', title);

        a.attr('href', url);
        a.attr('title', title);

        if (images.image_teaser_url != undefined) {
          a.append(img);
          $(value).append(a);
          cache(url, img.src);
        } else {
          // Not a valid dribbble
          // console.log(images);
        }
      });
    } else if (deviant_re.test(url)) {
      var oembed_url = 'http://backend.deviantart.com/oembed?url=' + encodeURIComponent(url) + '&format=jsonp&callback=?';
      request = $.getJSON(oembed_url, function(data) {
        images = data;
      }).done(function() {
        var a = $('<a>');
        var img = $('<img>');

        var title = '"' + images.title + '" by ' + images.author_name;

        img.attr('src', images.thumbnail_url);
        img.attr('alt', title);

        a.attr('href', url);
        a.attr('title', title);

        if (images.thumbnail_url != undefined && images.title != undefined) {
          a.append(img);
          $(value).append(a);
          cache(url, images.thumbnail_url);
        } else {
          // Not an image deviation.
          // console.log(images);
        }
      });
    } else if (flickr_re.test(url)) {
      var oembed_url = 'http://www.flickr.com/services/oembed?url=' + encodeURIComponent(url) + '&format=json&&maxwidth=300&jsoncallback=?';
      request = $.getJSON(oembed_url, function(data) {
        images = data;
      }).done(function() {
        var a = $('<a>');
        var img = $('<img>');

        var title = '"' + images.title + '" by ' + images.author_name;
        if (images.thumbnail_url != undefined) {
          var image_url = images.thumbnail_url.replace(/\_s\./, "_n.");
          img.attr('src', image_url);
          img.attr('alt', title);
        }

        a.attr('href', url);
        a.attr('title', title);

        if (images.thumbnail_url != undefined && images.title != undefined) {
          a.append(img);
          $(value).append(a);
          cache(url, image_url);
        } else {
          // Not a flickr photo.
          // console.log(images);
        }
      });
    } else {
      console.log("Unkown: " + url);
    }

    requests.push(request);
  });

  $('#container').imagesLoaded(function(){
    $('.embed').each(function(i, value) {
      $(value).addClass('item');
      $('#container').isotope('appended', $(value));
      $(value).removeClass('embed');
    });
  });

  function cache(source, img) {
    $.when(requests).done(function(){
      $.post('/cache', { 'favorite': source, 'image': img });
    });
  }
});
