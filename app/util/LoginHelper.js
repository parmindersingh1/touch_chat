
Ext.define('TouchChat.util.LoginHelper', {
    singleton: true,
    alternateClassName: ['LoginHelper'],
    requires: [
        'TouchChat.util.Config',
        'TouchChat.util.Common'
    ],
    config: {
        getUser: function() {
            if (Common.supportsHtml5Storage()) {
                var userString = window.localStorage.getItem("u");
                if(userString) {                  
                    var user = JSON.parse(userString);
                    return user;
                }
                else {
                    return null;
                }
            } else {
                console.error("Local storage not supported");
                return null;
            }
        },
        setUser: function(user) {
            if (Common.supportsHtml5Storage()) {
                var userString = JSON.stringify(user);               
                window.localStorage.setItem("u", userString);
            } else {
                console.error("Local storage not supported");
                return null;
            }
        },
        removeUser: function() {
            if (Common.supportsHtml5Storage()) localStorage.removeItem('u');
        }        
    },
    constructor: function() {
        return this.config;
    }
});