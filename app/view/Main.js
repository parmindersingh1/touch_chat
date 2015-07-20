Ext.define('TouchChat.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainView',
    requires: [
        'Ext.TitleBar',
        'TouchChat.view.LoginForm'
    ],
    config: {   
          items:[
          {
            title: 'Welcome',
            xtype: 'panel',
            itemId: 'homePanel',
            layout: 'vbox',
            items: [{
                xtype: 'container',
                html: 'Welcome to Chat App',
                itemId: 'homeLabel'

            }, {
                xtype: 'button',
                itemId: 'showLoginButton',               
                ui: 'action',
                text: 'Sign In',
                margin: 10
            }, {
                xtype: 'button',
                itemId: 'showSignupButton',
                ui: 'action',
                text: 'Sign Up',
                margin: 10
            }]
        }]
            
    }
});
