
Ext.define('TouchChat.view.RegisterForm', {
    extend: 'Ext.form.Panel',
    xtype: 'registerForm',

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
                itemId: 'registerScreenUser'
            }, {
                name: 'email',
                xtype: 'emailfield',
                label: 'Username*',
                placeHolder: 'Email',
                itemId: 'registerScreenEmail'
            },{
                name: 'password',
                xtype: 'passwordfield',
                label: 'Password*',
                placeHolder: 'secret',
                itemId: 'registerScreenPassword'
            }]
        }, {
            xtype: 'button',
            itemId: 'registerButton',
            margin: 20,
            padding: 8,
            text: 'SignUp',            
            iconMask: true,
            iconAlign: 'left',
            ui: 'action'
        }]
    }

});