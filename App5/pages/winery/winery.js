// For an introduction to the Page Control template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232511
(function () {
    "use strict";
    //function called when users navigate to winery.html
    WinJS.UI.Pages.define("/pages/winery/winery.html", {
        ready: function (element, options) {

            // API token to make calls to Checkvist OPEN API
            var apiToken = this.getToken();

            // GET request using api token
            // returns JSON and parsed on screen
            var formParams = 'token=' + apiToken;
            WinJS.xhr({
                type: 'GET',
                url: 'https://checkvist.com/checklists.json',
                data: formParams
            }).then(
                    function (success) {
                        var checklists = JSON.parse(success.responseText);
                        var table = document.getElementById('checklists');
                        for (var i = 0; i < checklists.length; i++) {
                            var checklist = checklists[i];
                            var row = table.insertRow();
                            var cell1 = row.insertCell();
                            var cell2 = row.insertCell();
                            console.log(checklist);
                            cell1.innerHTML = '<a href="/pages/wine/wine.html'
                                + '?id=' + checklist.id + '">'
                                + checklist.name + '</a>';
                            cell2.innerHTML = checklist.task_completed + '/' + checklist.task_count;
                        }

                        // added link handler Reference 1 in .pdf 
                        // add link handlers

                        WinJS.Utilities.query("a").listen("click", function (eventInfo) {
                            eventInfo.preventDefault();
                            var link = eventInfo.target;
                            // Reference 5 in .pdf
                            // saving id in session state
                            var linkString = link.href;
                            WinJS.Application.sessionState.checklistId = linkString.split('id=')[1];
                            WinJS.Navigation.navigate('/pages/wine/wine.html');
                        });
                    },
                    function (error) {
                        document.getElementById('errorMessage').innerHTML = 'Failed to get your checklists. Check your network connection.';
                    }
                );
        },

        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element) {
            /// <param name="element" domElement="true" />

            // TODO: Respond to changes in layout.
        },

        getToken: function () {
            var apiToken = WinJS.Application.sessionState.apiToken;
            if (!apiToken) {
                console.log("You are missing the token.");
            }
            return apiToken;
        }
    });
})();
