function displayProjects(projects) {
  _.each(projects, function (project) {
    $('#dashboard').append(
      '<div class="project">' +
        '<a href="' + project.url + '">' + project.name + '</a>' +
      '</div>'
    );

    _.each(project.mergeRequests, function (mergeRequest, index) {
      $('#dashboard').last().append(
        '<div>MR #' + mergeRequest.id + '(<span>' + mergeRequest.upvote + '</span>/<span>' + mergeRequest.downvote + '</span>)</div>'
      );
    });
  });
};


$(document).ready(function () {
  var api = new GitlabApi('https://gitlab.com/api/v4', '3oBioprn2GjJ52bdwBJ2');

  Project.get(api)
    .then(function (projects) {
      displayProjects(projects);
    })
    .catch(function (error) {
      console.log(error);
    })
});
