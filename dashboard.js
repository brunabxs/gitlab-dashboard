$(document).ready(function () {
  $.ajax({
    url: 'https://gitlab.com/api/v4/projects?membership=true',
    headers: {
      'PRIVATE-TOKEN': '3oBioprn2GjJ52bdwBJ2'
    },

  })
  .done(function(data, textStatus, jqXHR) {
    _.each(data, function (project) {
      $("#dashboard").append("<div class=\"project\">" + project.name + "</div>");
    });
    console.log(data);
  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log(textStatus);
    console.log(errorThrown);
  })
});
