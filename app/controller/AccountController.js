Ext.define('TouchChat.controller.AccountController', {
	extend: 'Ext.app.Controller',

    requires: [
        'Ext.Toast',
        'TouchChat.view.Main',       
        'TouchChat.util.Config',
        'TouchChat.view.Main'
    ],

    config: {
        refs: {
            mainView: 'mainView',
            loginForm: 'loginForm',
            registerForm: 'registerForm',         
            userPanel: 'userPanel',
            showUsersButton: 'mainView #showUsers'
        },
        control: {
            userPanel: {
                activate: 'onActivate',
                itemtap: 'onItemTap',
               },
               showUsersButton: {
                tap: 'showUsersList'
               }
        }
    },
    launch: function() {
       
    },
    onActivate: function() {
      console.log('User container is active');
     },
     
     onItemTap: function(view, index, target, record, event) {
         console.log('Item was tapped on the Data View');
         // console.log(view, index, target, record, event);
          var me = this;
        var userStore = Ext.getStore('UserStore');
         var userId;
          Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Signing up...'
                });
         if(event.target.type == "button"){
            userId = event.target.name;
         }
         else {
            userId =record.get('id');
         }
         var currentUser = userStore.getById(userId);
          QB.users.delete(parseInt(userId), function(err, user){
              if (user) {
                console.log("Deleted User is " + JSON.stringify(user));                
                userStore.remove(currentUser);
              } else  {
                console.log("Error Deleting User  " + JSON.stringify(err));
              }
               Ext.Viewport.unmask();
            });
        },
        showUsersList: function(button, e, eOpts) {
            console.log("tap");
            var mainView = this.getMainView();
            mainView.push({
                            itemId: 'userPanel',
                            xtype: "userPanel",
                            title: "Users"
                        });
        }
});