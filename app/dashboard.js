function displayProjects(projects) {
  _.each(projects, function (project) {
    $('#dashboard').append('<div class="project"><a href="' + project.url + '">' + project.name + '</a></div>');
  });
};


$(document).ready(function () {
  var api = new GitLabApi('https://gitlab.com/api/v4', '3oBioprn2GjJ52bdwBJ2');

  api.projects()
    .then(function (projects) {
      displayProjects(projects);
    })
    .catch(function (error) {
      console.log(error);
    })
});
