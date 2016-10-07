var DashBoard = (function () {
    var _table_ = document.getElementById('catalog'),
        _thead_ = document.createElement('thead'),
        _tbody_ = document.createElement('tbody'),
        _tr_ = document.createElement('tr'),
        _th_ = document.createElement('th'),
        _td_ = document.createElement('td'),
        _button_ = document.createElement('button');

    function loadJSON(response) {
        return buildHtmlTable(JSON.parse(response).projects);
    }

    function getItemList(callback) {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'js/data.json', false);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                 callback(xobj.responseText);
            }
        };
        xobj.send(null);
    }(loadJSON);

    function buildHtmlTable(arr) {
        var table = _table_,
            tbody = _tbody_.cloneNode(false),
            columns = addAllColumnHeaders(arr, table);
        for (var i = 0, maxi = arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j = 0, maxj = columns.length; j < maxj; ++j) {
                var td = _td_.cloneNode(false),
                    button = _button_.cloneNode(false);
                cellValue = arr[i][columns[j]];
                table.appendChild(tbody);
                tbody.appendChild(tr);
                td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                tr.appendChild(td);
            }
            table.appendChild(tbody);
            tbody.appendChild(tr);
            tr.appendChild(button);
        }
        return table;
    }

    function addAllColumnHeaders(arr, table) {
        var columnSet = [],
            tr = _tr_.cloneNode(false),
            thead = _thead_.cloneNode(false);
        for (var i = 0, l = arr.length; i < l; i++) {
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
                    columnSet.push(key);
                    table.appendChild(thead);
                    var th = _th_.cloneNode(false);
                    thead.appendChild(th);
                    th.appendChild(document.createTextNode(key));
                    tr.appendChild(th);
                }
            }
        }
        table.appendChild(thead);
        thead.appendChild(tr);
        return columnSet;
    }

    return {
        buildHtmlTable: buildHtmlTable,
        // page: page
        loadJSON: loadJSON,
        getItemList: getItemList,
    };
})();

DashBoard.getItemList(DashBoard.loadJSON);