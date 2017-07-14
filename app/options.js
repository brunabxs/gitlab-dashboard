function saveOptions() {
    chrome.storage.sync.set({
        'gitlab': $('#gitlab').val(),
        'gitlabPrivateToken': $('#gitlab-private-token').val()
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
        'gitlabPrivateToken': ''
    }, function (items) {
        $('#gitlab').val(items.gitlab);
        $('#gitlab-private-token').val(items.gitlabPrivateToken)
    });
}

$(document).ready(function () {
    restoreOptions();
    $('#save').click(function () {
        saveOptions();
    });
});
