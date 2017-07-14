function saveOptions() {
    chrome.storage.sync.set({
        'gitlab': $('#gitlab').val(),
        'gitlabPrivateToken': $('#gitlab-private-token').val(),
        'dashboardRefreshRate': $('#dashboard-refresh-rate').val()
    }, function () {
        $('#status').text('Options saved.');
        $('#save').hide();
        setTimeout(function () {
            $('#save').show();
            $('#status').text('');
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        'gitlab': '',
        'gitlabPrivateToken': '',
        'dashboardRefreshRate': 3
    }, function (items) {
        $('#gitlab').val(items.gitlab);
        $('#gitlab-private-token').val(items.gitlabPrivateToken);
        $('#dashboard-refresh-rate').val(items.dashboardRefreshRate);
    });
}

$(document).ready(function () {
    restoreOptions();
    $('#save').click(function () {
        saveOptions();
    });
});
