var DashBoard = (function () {
    var _table_ = document.getElementById('catalog'),
        _thead_ = document.createElement('thead'),
        _tbody_ = document.createElement('tbody'),
        _tr_ = document.createElement('tr'),
        _th_ = document.createElement('th'),
        _td_ = document.createElement('td'),
        _button_ = document.createElement('button');
    function getItemList() {
        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', 'js/data.json', false);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                JSON.parse(xobj.responseText);
            }
        };
        xobj.send();
        return JSON.parse(xobj.responseText).projects;
    }

    function buildHtmlTable(arr) {
        document.getElementById('catalog').innerHTML = '';
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

    function checkboxesFiltrationController() {
        var checkboxes = document.querySelectorAll('#checkboxesArea input');
        var checkboxesSatus = new Array();
        checkboxes.forEach(function (key) {
            key.addEventListener('change', function (el) {
                if (el.target.checked) {
                    checkboxesSatus.push(el.target.name);
                } else {
                    for (var key in checkboxesSatus) {
                        if (checkboxesSatus[key] === el.target.name) {
                            var index = checkboxesSatus.indexOf(el.target.name);
                            if (index > -1) {
                                checkboxesSatus.splice(index, 1);
                            }
                        }
                    }
                }
            })
        })
        console.log(checkboxesSatus);
        return checkboxesSatus;
    }

    function filterByName(obj) {
        var condition = document.getElementById('searchByName').value;
        if (obj.name.indexOf(condition) > -1 || obj.name.indexOf(condition.toUpperCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    function filterByType(activeCheckboxes) {
        console.log(activeCheckboxes);
        return function (obj) {
            if (obj.type.indexOf(activeCheckboxes) > -1){
                return true;
            } else {
                return false;
            }
        }
    }

    return {
        getItemList: getItemList,
        buildHtmlTable: buildHtmlTable,
        filterByName: filterByName,
        filterByType: filterByType,
        checkboxesFiltrationController: checkboxesFiltrationController,
    }

})();

DashBoard.buildHtmlTable(DashBoard.getItemList());

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
});

var searchForm = document.getElementById('form');
searchForm.addEventListener('keyup', function () {
    DashBoard.buildHtmlTable(DashBoard.getItemList().filter(DashBoard.filterByName));
});

var aka = document.getElementById('checkboxesArea');
aka.addEventListener('click', function () {
    // console.log(DashBoard.buildHtmlTable(DashBoard.getItemList().filter(DashBoard.filterByType(DashBoard.checkboxesFiltrationController()))));
    console.log(DashBoard.getItemList().filter(DashBoard.filterByType(DashBoard.checkboxesFiltrationController())));
});
