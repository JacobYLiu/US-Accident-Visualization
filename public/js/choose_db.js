$(document).ready(() => {
    $('#upload-result').hide();
    $('#upload-btn').hide();

    let dropArea = document.getElementById('drop-area');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    });

    dropArea.addEventListener('drop', handleDrop, false)

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight')
    }
})

let file;

function handleDrop(e) {
    let files = e.dataTransfer.files;
    displayFileInfo(files[0]);
}

function handleInput(files) {
    displayFileInfo(files[0]);
}

function displayFileInfo(fileToUpload) {
    file = fileToUpload;
    $('#upload-result').show();
    $('#upload-btn').show();
    $('#file-name').text(file.name);
    $('#file-size').text(`${Math.ceil(file.size / 1024 / 1024)}  MB`);
}

function uploadFile(event) {
    event.preventDefault();

    let formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/db/import',
        type: 'post',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = (evt.loaded / evt.total) * 100;
                    console.log(percentComplete);
                    $('.progress-bar').val(percentComplete);
                }
            }, false);
            return xhr;
        }
    })
    .done(result => {
        if (!result.error) {
            location.reload();
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })
}

function defaultCSV(event) {
    event.preventDefault();
    $.ajax({
        url: '/db/default',
        type: 'get',
        dataType: 'json'
    })
    .done(result => {
        if (!result.error) {
            location.reload();
        }
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })
}
