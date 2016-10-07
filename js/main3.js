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
        clearTableData()
        var table = _table_,
            tbody = _tbody_.cloneNode(false),
            columns = addAllColumnHeaders(arr, table);
        for (var i = 0, maxi = arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j = 0, maxj = columns.length; j < maxj; ++j) {
                var td = _td_.cloneNode(false),
                    button = _button_.cloneNode(false);
                button.className = "delete-item";
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

    function clearTableData() {
        return document.getElementById('catalog').innerHTML = '';
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

    function getActiveCheckboxes() {
        var checkboxes = document.querySelectorAll('#checkboxesArea input');
        var checked_ar = [];
        for (key in checkboxes)
            if (checkboxes[key].checked) {
                checked_ar.push(checkboxes[key].value)
            }
        return checked_ar;
    }

    function getSelectedDate() {
        var selectedDate = document.getElementById('datepicker').value;
        var formatedDate = moment(selectedDate).format("DD-MM-YYYY");
        return formatedDate
    }

    function getCurrentDate() {
        var currentDate = moment().format('DD-MM-YYYY');
    }

    function getInputSearchValue() {
        var condition = document.getElementById('searchByName').value;
        return condition
    }

    function filtrationController(searchValue, checkedTypes, selectedDate) {
        var ERROR_MSG = 'Invalid date';
        var filtrationValues = {
            search: searchValue(),
            checkboxes: checkedTypes(),
            selectedDate: getSelectedDate(),
            currentDate: getCurrentDate(),
            error: function () {
                if (getSelectedDate() === ERROR_MSG)
                    return true;
            }
        }
        return filtrationValues;
    }

    function multipleFiltration(obj) {
        console.log(obj);
        var flag = true;

        if (!this.error()) {
            if (obj.due_date == this.selectedDate) {
                flag = true;
            } else {
                flag = false
            }
        }

        if (this.checkboxes.length && flag) {
            flag = false;

            for (key in this.checkboxes) {
                if (obj.type == this.checkboxes[key]) {
                    flag = true;
                }
            }
        }
        if (flag)
            if (obj.name.indexOf(this.search) > -1 || obj.name.indexOf(this.search.toUpperCase()) > -1)
                return flag;
    }

    function removeSelectedItem(deletedItem) {
        deletedItem.addEventListener('click', function () {
            deletedItem.parentNode.remove(deletedItem.parentNode);
        })
    }

    return {
        getItemList: getItemList,
        buildHtmlTable: buildHtmlTable,
        checkboxesFiltrationController: getActiveCheckboxes,
        getInputSearchValue: getInputSearchValue,
        getActiveCheckboxes: getActiveCheckboxes,
        filtrationController: filtrationController,
        multipleFiltration: multipleFiltration,
        getSelectedDate: getSelectedDate,
        getCurrentDate: getCurrentDate,
        removeSelectedItem: removeSelectedItem

    }
})();

DashBoard.buildHtmlTable(DashBoard.getItemList());

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
});

var searchForm = document.getElementById('form');
searchForm.addEventListener('keyup', function () {
    console.log(DashBoard.getItemList().filter(DashBoard.multipleFiltration, DashBoard.filtrationController(DashBoard.getInputSearchValue, DashBoard.getActiveCheckboxes)));
    DashBoard.buildHtmlTable(DashBoard.getItemList().filter(DashBoard.multipleFiltration, DashBoard.filtrationController(DashBoard.getInputSearchValue, DashBoard.getActiveCheckboxes)));
});

var filter_wrap = document.querySelectorAll('#checkboxesArea input');
filter_wrap.forEach(function (el) {
    el.addEventListener('change', function () {
        DashBoard.buildHtmlTable(DashBoard.getItemList().filter(DashBoard.multipleFiltration, DashBoard.filtrationController(DashBoard.getInputSearchValue, DashBoard.getActiveCheckboxes)));
        console.log(DashBoard.getItemList().filter(DashBoard.multipleFiltration, DashBoard.filtrationController(DashBoard.getInputSearchValue, DashBoard.getActiveCheckboxes)));
    })
});

var dateForSearch = document.getElementById('datepicker');
dateForSearch.addEventListener('change', function () {
    DashBoard.buildHtmlTable(DashBoard.getItemList().filter(DashBoard.multipleFiltration, DashBoard.filtrationController
    (DashBoard.getInputSearchValue, DashBoard.getActiveCheckboxes, DashBoard.getSelectedDate)));
    console.log(DashBoard.getSelectedDate());
});

var dashboard = document.querySelectorAll('.delete-item');
console.log(dashboard);
dashboard.forEach(function (el) {
    DashBoard.removeSelectedItem(el);
});