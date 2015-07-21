Ext.define('TouchChat.util.Common', {
    singleton: true,
    alternateClassName: ['Common'],

    requires: [
        'Ext.device.Geolocation'
    ],

    config: {
        supportsHtml5Storage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        },
        supportsHtml5SessionStorage: function() {
            try {
                return 'sessionStorage' in window && window['sessionStorage'] !== null;
            } catch (e) {
                return false;
            }
        },
    },
    constructor: function() {
        return this.config;
    }

});