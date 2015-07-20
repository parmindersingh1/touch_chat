
Ext.define('TouchChat.view.LoginForm', {
    extend: 'Ext.form.Panel',
    xtype: 'loginForm',

    requires: [
        'Ext.field.Text',
        'Ext.Button',
        'Ext.form.FieldSet',
        'Ext.form.Email',
        'Ext.field.Password'
    ],

    config: {
        //cls: 'form-bg',
        items: [{
            xtype: 'fieldset',
            title: 'Login',
            instructions: "Welcome!",

            items: [{
                name: 'login',
                xtype: 'textfield',
                label: 'Username*',
                placeHolder: 'user',
                itemId: 'loginScreenUser'
            }, {
                name: 'password',
                xtype: 'passwordfield',
                label: 'Password*',
                placeHolder: 'secret',
                itemId: 'loginScreenPassword'
            }]
        }, {
            xtype: 'button',
            itemId: 'loginButton',
            margin: 20,
            padding: 8,
            text: 'Login',            
            iconMask: true,
            iconAlign: 'left',
            ui: 'action'
        }]
    }

});