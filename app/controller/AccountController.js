Ext.define('TouchChat.controller.AccountController', {
	extend: 'Ext.app.Controller',

    requires: [
        'Ext.Toast',
        'TouchChat.view.Main',       
        'TouchChat.util.Config',
        'TouchChat.view.MainTabs',
        'TouchChat.util.LoginHelper',
        'TouchChat.view.MessageList'
    ],

    config: {
        refs: {
            mainView: 'mainView',
            loginForm: 'loginForm',
            registerForm: 'registerForm',         
            userPanel: 'userPanel',
            showUsersButton: 'mainView #showUsers',
            logoutButton: 'mainTabsPanel #logoutButton',
             tabs: 'mainTabsPanel > tabpanel > tabbar > tab',
             messageList: 'messagelist',
             sendMessage: 'messagelist #sendMessage'
        },
        control: {
            userPanel: {
                activate: 'onActivate',
                itemtap: 'onItemTap',
               },
               showUsersButton: {
                tap: 'showUsersList'
               },
               logoutButton: {
                tap: 'onLogoutButtonTap'
               },
              tabs : {
                  tap : 'tabClicked'
              },
              sendMessage: {
                tap: 'sendMessage'
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
                    message: 'Deleting...'
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
        },
        onLogoutButtonTap: function(button, e, eOpts){
            var me = this;
            var mainView = me.getMainView();
             Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Loging Out...'
                });
            QB.logout(function(err, result){
              if (result) {
                console.log(result);
                LoginHelper.removeUser();
                Ext.Viewport.setActiveItem(mainView);
              } else  {
                Ext.Msg.alert(err.message);
              }    
              Ext.Viewport.unmask();
            });
        },
        tabClicked: function(button, e, eOpts) {
        var me = this;
        var user = LoginHelper.getUser();
          if(button.getTitle() === 'Chats' ) {
            me.connectChat(user);
           }
        },
        connectChat: function(chatUser){
            var me = this;
            console.log("Inside connectChat");
            Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Connecting...'
                });

            var params = {
                    jid: QB.chat.helpers.getUserJid(chatUser.id, Config.config.qbApp.appID), 
                    password: chatUser.password
                  };
              console.log(params);
              QB.chat.connect( params, function(err, res) {
              if (err) {
                console.log("Error at connectChat"+ err);
              } else {
                console.log("chat connected");
                Ext.Viewport.unmask();
                me.createRoom();
                QB.chat.onMessageListener = function(senderId, message) {
  
                  // check if this message is a notification about new room
                  if (message.extension && message.extension.notification_type === '1') {

                    // join to created room
                    QB.chat.muc.join(message.extension.room_jid, function() {
                      // some actions
                    });
                  }             
              }
            }
              
            });


        },
        createRoom: function() {
          console.log("in create room");
          Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Please Wait...'
                });

          var userStore = Ext.getStore('UserStore'),
              appId = Config.config.qbApp.appID,
              me = this,
              arr = [];
            userStore.each(function(rec) {                
                    arr.push(rec.get('id'));                
            });           
            var ids = arr.join(","); 
            QB.chat.dialog.create({type: 2, occupants_ids: ids, name: 'New dialog'}, function(err, dialog) {
               console.log(dialog);
             // dialog was created
              if (dialog) {
                var jid = dialog.xmpp_room_jid;
                console.log("************************" + dialog.xmpp_room_jid);

                // join to created room
                QB.chat.muc.join(dialog.xmpp_room_jid, function() {

                  // send notifications about adding people
                  for (var i = 0, len = dialog.occupants_ids.length, id, jid; i < len; i++) {
                    id = dialog.occupants_ids[i];
                    jid = QB.chat.helpers.getUserJid(id, appId); // appId - your QB application ID

                    QB.chat.send(jid, {type: 'chat', extension: {
                      // your flag which you will check when will receive a message
                      notification_type: '1',
                      
                      // another extra parameters which can be needed
                      dialog_id: dialog._id,
                      room_jid: dialog.xmpp_room_jid,
                      room_name: dialog.name,
                      occupants_ids: dialog.occupants_ids.join()
                    }});
                  }
                  Ext.Viewport.unmask();

                });
              }
            });



           // var userJid = QB.chat.helpers.getUserJid(parseInt(user.id), parseInt(appId));
           // console.log(userJid);

        },
        sendMessage: function(button, e, eOpts ) {
          console.log("sendMessage");
          var messageBody = Ext.ComponentQuery.query('messagelist #messageBody')[0];
          console.log(Ext.ComponentQuery.query('messagelist #messageBody')[0]);
          console.log(messageBody.getValue());
          // var me = this;
          // var message = {
          //         body: $('#textMessage').val(),
          //         type: 'groupchat',
          //         extension: {
          //     save_to_history: 1,
          //     date_sent: Math.floor(Date.now() / 1000)
          //   }
          // };
          // $('#textMessage').val('');
          // QB.chat.send(current_room, message);
          // console.log("Message sent");

        }

});