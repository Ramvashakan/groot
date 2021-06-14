function upload() {

    var fileUpload = document.getElementById("myFile");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                console.log(fileUpload.files[0]);
                saveToDataBase(e.target.result, fileUpload.files[0].name)
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
}

async function saveToDataBase(data, fileName) {



    const result = await fetch('/upload', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data,
            fileName
        })
    }).then((response) => response.json())

    alert(result.response)
}

function viewRecords() {
    var fileUpload = document.getElementById("myFile");
    Papa.parse(fileUpload.files[0], {
        complete: function (results) {
            var data = parseData(results);
            var div = document.getElementById('view-records');
            div.innerHTML = data
        }
    });
}

function parseData(results) {
    const data = results.data;

    if (data.length == 0) {
        return "<span class='no-data' >Data Not Found</span>"
    }


    var table = "<table id='records'><tr>"
    for (var i = 0; i < data[0].length; i++) {

        table = table + "<th>" + data[0][i] + "</th>";

    }

    table = table + "</tr>"

    for (var i = 1; i < data.length; i++) {
        table = table + "<tr>"
        for (var j = 0; j < data[i].length; j++) {
            table = table + "<td>" + data[i][j] + "</td>";
        }
        table = table + "</tr>"
    }
    table = table + "</table>"

    return table;
}

function clearRecords() {

    var div = document.getElementById('view-records');
    div.innerHTML = "";

}