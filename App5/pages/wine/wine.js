// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    //function called when user navigates to wine.html and populates data
    WinJS.UI.Pages.define("/pages/wine/wine.html", {
        ready: function (element, options) {
            // grabbing checklist id from session state
            var id = WinJS.Application.sessionState.checklistId

            // GET request for wines - parsed JSON to wine.html
            WinJS.xhr({
                type: 'GET',
                url: 'https://checkvist.com/checklists/' + id + '.json'
            }).then(
                    function (success) {
                        var checklist = JSON.parse(success.responseText);
                        document.getElementById('title').innerHTML = checklist.name;
                    },
                    function (error) {
                        document.getElementById('errorMessage').innerHTML = 'Failed to get your checklist. Check your network connection.';
                    }
                );

            // GET request for wine information 
            WinJS.xhr({
                type: 'GET',
                url: 'https://checkvist.com/checklists/' + id + '/tasks.json'
            }).then(
                    function (success) {
                        var tasks = JSON.parse(success.responseText);
                        var table = document.getElementById('tasks');
                        for (var i = 0; i < tasks.length; i++) {
                            var task = tasks[i];
                            var row = table.insertRow();
                            var cell1 = row.insertCell();
                            var cell2 = row.insertCell();

                            console.log(task);
                            cell1.innerHTML = task.content;
                            cell2.innerHTML = (task.status == 1) ? '&#10004;' : '';
                        }
                    },
                    function (error) {
                        document.getElementById('errorMessage').innerHTML = 'Failed to get your wine list. Check your network connection.';
                    }
                );
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        }


    });

    function buttonClickHandler(eventInfo) {
        var id = WinJS.Application.sessionState.checklistId;
        var content = document.getElementById('winename').value;
        var formParams = 'wine[content]=' + content + '&wine[tags]=none&wine[due_date]=05/08/2016';
            try {

                WinJS.xhr({
                    type: 'POST',
                    url: 'https://checkvist.com/checkslists/' + id + '/wines.json',
                    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
                    data: formParams
                }).then(
                    function (success) {
                        // Google Checkvist open api group reference 6 in .pdf
                        var response = JSON.parse(success.responseText);
                        console.log(response); 
                        //WinJS.Application.sessionState.apiToken = response.slice(0, response.length);

                        // navigates to checkvist page
                        WinJS.Navigation.navigate('/pages/checkvist/checkvist.html');
                    },
                    function (error) {
                        document.getElementById('errorMessage').innerHTML = "Invalid wine Entry. Try again.";
                    }
                );
            } catch (e) {
                console.log(e.message);
            }
       }

})();
