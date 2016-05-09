(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        //function called when user navigates to home.html
        ready: function (element, options) {
            
            //Event Handlers 
            var signInButton = document.getElementById('signin');
            signInButton.addEventListener('click', this.signInEventHandler, false);

            //**PHONE FUNCTIONALITY REQUIREMENT** Credentials from redential locker

            //Reference 7 in .pdf
            var roamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
            try {
                var resource = 'checkvist';
                var username = roamingSettings.values['username'];

                var vault = new Windows.Security.Credentials.PasswordVault();
                var cred = vault.retrieve(resource, username);

                if (cred !== null) {
                    // There is a credential stored in the locker
                    // Populate the password property of the credential 
                    // for automatic login
                    document.getElementById('username').value = cred.userName;
                    document.getElementById('password').value = cred.password;
                    console.log('Credential Retrieved. Resource: ' + cred.resource
                    + ' Username: ' + cred.userName
                    + ' Password: ' + cred.password.toString());
                } else {
                    // There is no credential stored in the locker
                    // Display to UI to get user credentials
                    console.log('Credential not found.');
                }
            } catch (e) {
                console.log(e.message);
                return;
            }
        },

        signInEventHandler: function (eventInfo) {
            var resource = 'checkvist';
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;

            // saves username to roaming so it can be restored across sessions
            var appData = Windows.Storage.ApplicationData.current;
            var roamingSettings = appData.roamingSettings;
            roamingSettings.values['username'] = username;

            try {
                //saving credentials to password vault 
                var vault = new Windows.Security.Credentials.PasswordVault();
                var cred = new Windows.Security.Credentials.PasswordCredential(resource, username, password);
                vault.add(cred);

                console.log('Credential saved to vault. Resource: ' + cred.resource
                    + ' Username: ' + cred.userName
                    + ' Password: ' + cred.password.toString());

                // WinJS.xhr POST header requirements reference 8 inn .pdf
                var formParams = 'username=' + encodeURIComponent(cred.userName)
                    + '&remote_key=' + encodeURIComponent(cred.password.toString());
                WinJS.xhr({
                    type: 'POST',
                    url: 'https://checkvist.com/auth/login.json',
                    headers: { 'Content-type': 'application/x-www-form-urlencoded' },
                    data: formParams
                }).then(
                    function (success) {
                        //saving api token to session state 
                        var response = success.responseText.toString();
                        WinJS.Application.sessionState.apiToken = response.slice(0, response.length);

                        // navigates to winery.html
                        WinJS.Navigation.navigate('/pages/winery/winery.html');
                    },
                    function (error) {
                        document.getElementById('errorMessage').innerHTML = "Invalid username or password. Try again.";
                    }
                );

            } catch (e) {
                console.log(e.message);
            }
        }
    });
})();