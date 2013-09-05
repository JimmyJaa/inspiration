$(document).foundation();
$('#container').isotope({ itemSelector : '.item' });
$('#container').isotope('shuffle');

$('.embed').each(function(index, value) {
  var url = $(value).data('embed');
  var oembed_url = 'http://backend.deviantart.com/oembed?url=' + encodeURIComponent(url) + '&format=jsonp&callback=?';
  $.getJSON(oembed_url, function(data) {
    images = data;
  }).complete(function() {
    var a = $('<a>');
    var img = $('<img>');
    var div = $('<div class="item">');

    var title = '"' + images.title + '" by ' + images.author_name;

    img.attr('src', images.thumbnail_url);
    img.attr('alt', title);

    a.attr('href', url);
    a.attr('title', title);

    if (images.thumbnail_url != undefined && images.title != undefined) {
      a.append(img);
      div.append(a);
      $('#container').imagesLoaded(function(){ $('#container').isotope('insert', div); });
    } else {
      console.log(images);
    }
  });
});
