$(document).ready(() => {
    retrieveAccidents();
});

function searchByID(event) {
    event.preventDefault();
    const id = $('#db-search-input').val();
    $.ajax({
        url: `/accidents/${id}`,
        type: 'get',
        datatype: 'json'
    })
    .done(result => {
        $('#db-table-body').empty();
        $('#db-table-body').append(generateTableCell(result.accident));
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })
}


function resetSearch(event) {
    event.preventDefault();
    $('#db-search-input').val('');
    $('#db-table-body').empty();
    retrieveAccidents();
}

function exportCSV(event) {
    event.preventDefault();
    $('.export-btn').prop('disabled', true);
    $('#export-text').show();
    $.ajax({
        url: `/db/export`,
        type: 'get',
        xhrFields: {
            responseType: 'blob'
        }
    })
    .done((response, status, xhr) => {
        var fileName = xhr.getResponseHeader('Content-Disposition').split("=")[1]
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(response);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        $('.export-btn').prop('disabled', false);
        $('#export-text').hide();
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
        $('.export-btn').prop('disabled', false);
    })

}

function addAccident(event) {
    event.preventDefault();
    $('#db-table-body').prepend(`
        <tr id="insert-row">
            <td></td>
            <td><input type="text" name="City"></td>
            <td><input type="text" name="County"></td>
            <td><input type="text" name="State"></td>
            <td><input type="text" name="Zipcode"></td>
            <td><input type="text" name="Start_Time"></td>
            <td><input type="text" name="End_Time"></td>
            <td><input type="text" name="Start_Lat"></td>
            <td><input type="text" name="Start_Lng"></td>
            <td><input type="text" name="End_Lat"></td>
            <td><input type="text" name="End_Lng"></td>
            <td><input type="text" name="Severity"></td>
            <td><input type="text" name="Weather_Condition"></td>
            <td><input type="text" name="Visibility"></td>
            <td><input type="text" name="Wind_Speed"></td>
            <td><input type="text" name="Temperature"></td>
            <td class="db-action-col">
                <img class="db-action-img" id="edit" src="../public/assets/accept.png" onclick="insertAccident()">
                <img class="db-action-img" src="../public/assets/cancel.png" onclick="cancelAdd()">
            </td>
        </tr>
    `);
    $.each($('#insert-row').children(), (index, item) => {
        if (index != 0) {
            $(item).find('input').css("border", "1px solid rgb(145, 154, 172)");
        }
    })
}

function insertAccident() {
    let data = {};

    $.each($('#insert-row').children(), (index, item) => {
        if (index != 0 && index != ($('#insert-row').children().length - 1)) {
            const field = $(item).find('input').attr('name');
            const value = $(item).find('input').val();
            data[field] = value;
        }
    });

    $.ajax({
        url: `/accidents`,
        type: 'post',
        data: data,
    })
    .done(result => {
        console.log(result);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })

    cancelAdd(event);
}

function cancelAdd() {
    $('#insert-row').remove();
}

function editAccident(event) {
    const tr = $(event.target).parent().parent();

    $.each(tr.children(), (index, item) => {
        if (index != 0) {
            $(item).find('input').prop('disabled', false);
            $(item).find('input').css("border", "1px solid rgb(145, 154, 172)");
        }
    });

    $(event.target).attr('src', '../public/assets/accept.png');
    $(event.target).next().attr('src', '../public/assets/cancel.png');
    $(event.target).attr('onclick', 'updateAccident(event)');
    $(event.target).next().attr('onclick', 'cancel(event)');
}

function deleteAccident(event) {
    $(event.target).attr('src', '../public/assets/cancel.png');
    $(event.target).prev().attr('src', '../public/assets/accept.png');
    $(event.target).attr('onclick', 'cancel(event)');
    $(event.target).prev().attr('onclick', 'removeAccident(event)');
}

function removeAccident(event) {
    const tr = $(event.target).parent().parent();
    tr.remove();
    const ID = tr.attr('data-row');

    $.ajax({
        url: `/accidents/${ID}`,
        type: 'delete'
    })
    .done(result => {
        console.log(result);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })
}

function updateAccident(event) {
    event.preventDefault();
    const tr = $(event.target).parent().parent();

    const ID = tr.attr('data-row');
    let data = {};

    $.each(tr.children(), (index, item) => {
        if (index != 0 && index != (tr.children().length - 1)) {
            const field = $(item).find('input').attr('name');
            const value = $(item).find('input').val();
            data[field] = value;
        }
    });

    $.ajax({
        url: `/accidents/${ID}`,
        type: 'put',
        data: data,
    })
    .done(result => {
        console.log(result);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        console.log(jqXHR);
    })

    resumeOriginal(event);
}

function cancel(event) {
    resumeOriginal(event);
}

function resumeOriginal(event) {
    const row = $(event.target).parent().parent();
    const parent = $(event.target).parent();
    $.each(row.children(), (index, item) => {
        if (index != 0) {
            $(item).find('input').prop('disabled', true);
            $(item).find('input').css("border", "none");
        }
    });

    $.each(parent.children(), (index, item) => {
        if (index == 0) {
            $(item).attr('src', '../public/assets/edit.png');
            $(item).attr('onclick', 'editAccident(event)');
        } else {
            $(item).attr('src', '../public/assets/delete.png');
            $(item).attr('onclick', 'deleteAccident(event)');
        }
    })
}

function retrieveAccidents() {
    $.ajax({
        url: `/accidents?&page=1&limit=15`,
        type: 'get',
        datatype: 'json'
    })
    .done(function(result) {
        populateTable(result.accidents);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
    })
}

function populateTable(accidents) {
    accidents.forEach(accident => {
        $('#db-table-body').append(generateTableCell(accident));
    });
}

function generateTableCell(accident) {
    let visibility = accident["Visibility(mi)"]
    let windSpeed = accident["Wind_Speed(mph)"]
    let temperature = accident["Temperature(F)"]
    const html = `
        <tr data-row="${accident.ID}">
            <td><input type="text" name="ID" value="${accident.ID}" disabled></td>
            <td><input type="text" name="City" value="${accident.City}" disabled></td>
            <td><input type="text" name="County" value="${accident.County}" disabled></td>
            <td><input type="text" name="State" value="${accident.State}" disabled></td>
            <td><input type="text" name="Zipcode" value="${accident.Zipcode}" disabled></td>
            <td><input type="text" name="Start_Time" value="${accident.Start_Time}" disabled></td>
            <td><input type="text" name="End_Time" value="${accident.End_Time}" disabled></td>
            <td><input type="text" name="Start_Lat" value="${accident.Start_Lat}" disabled></td>
            <td><input type="text" name="Start_Lng" value="${accident.Start_Lng}" disabled></td>
            <td><input type="text" name="End_Lat" value="${accident.End_Lat}" disabled></td>
            <td><input type="text" name="End_Lng" value="${accident.End_Lng}" disabled></td>
            <td><input type="text" name="Severity" value="${accident.Severity}" disabled></td>
            <td><input type="text" name="Weather_Condition" value="${accident.Weather_Condition}" disabled></td>
            <td><input type="text" name="Visibility(mi)" value="${visibility}" disabled></td>
            <td><input type="text" name="Wind_Speed(mph)" value="${windSpeed}" disabled></td>
            <td><input type="text" name="Temperature(F)" value="${temperature}" disabled></td>
            <td class="db-action-col">
                <img class="db-action-img" id="edit" src="../public/assets/edit.png" onclick="editAccident(event)">
                <img class="db-action-img" src="../public/assets/delete.png" onclick="deleteAccident(event)">
            </td>
        </tr>
    `;

    return html;
}
