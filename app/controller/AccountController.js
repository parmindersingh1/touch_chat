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
                itemtap: 'deleteUser'
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
              },
              messageList: {
                itemtap: 'deleteMessage'
              }
              // ,
              // messageList: {
              //   initialize: function (list) {
              //     var me = this,
              //     //   scroller = list.getScrollable().getScroller();

              //     // scroller.on('maxpositionchange', function (scroller, maxPos, opts) {
              //     //   me.setMaxPosition(maxPos.y);
              //     // });

              //     // me.setScroller(scroller);

              //     // me.getMessage().setValue(Ext.create('Chat.ux.LoremIpsum').getSentence());
              //   }
              // }
        }
    },
    launch: function() {
       
    },
    onActivate: function() {
      console.log('User container is active');
     },
     
     deleteUser: function(view, index, target, record, event) {
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
           } else {
            me.chatRoom = null;
            QB.chat.disconnect();
           }
        },
        connectChat: function(chatUser){
            var me = this;
            var currentUser = LoginHelper.getUser();
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
                  } else {
                       message.local = false;
                        // regex = new RegExp('^' + String(currentUser.id) + '$', 'i');  
                      // if(regex.test(String(senderId))) {
                      if(currentUser.id == senderId) {
                        // Ext.apply({local: true}, message);
                        message.local= true;
                      } 
                      me.addMessage(message, senderId);
                      console.log(message);
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
          Ext.getStore('Messages').removeAll();
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
                me.chatRoom = dialog.xmpp_room_jid;
                me.getRoomHistory();
               
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
           var currentUser = LoginHelper.getUser();
          console.log(messageBody);
          var me = this;
          var message = {
                  body: messageBody.getValue(),
                  type: 'groupchat',
                  extension: {
              save_to_history: 1,
              date_sent: Math.floor(Date.now() / 1000)              
            }
          };
          messageBody.setValue('');
          QB.chat.send(me.chatRoom, message);
          console.log("Message sent");
        },
        addMessage: function(message,userId) {
          var user = Ext.getStore('UserStore').getById(userId);
           console.log( message);
          var storeMessage = {
            id: message.id,
            login: user.get('login'),
            message: message.body,
            local: message.local 
          }
          Ext.getStore('Messages').add(storeMessage);

          // if (this.getMaxPosition()) {
          //   this.getScroller().scrollToEnd(true);
          // }
        },
        getRoomHistory: function() {
          var me = this;
          QB.chat.message.list({chat_dialog_id: QB.chat.helpers.getDialogIdFromNode(me.chatRoom)}, function(err, message) {
            if (err) {
              console.log(err);
            } else {
                console.log(message.items.length);
              // for (var i = 0; i < message.items.length; i++) {
              //   $('.messages p').append(message.items[i].sender_id + ': ' + message.items[i].message + '<br />');
              // };
             // console.log('*************History ends***************');
            }
          });
        },
         deleteMesage: function(view, index, target, record, event) {
           console.log('Item was tapped on the Data Message View');
           // console.log(view, index, target, record, event);
          var me = this;
          var messageStore = Ext.getStore('Messages');
           var msgId;
            Ext.Viewport.mask({
                      xtype: 'loadmask',
                      indicator: true,
                      message: 'Deleting...'
                  });
           if(event.target.type == "button"){
              msgrId = event.target.name;
           }
           else {
              msgId =record.get('id');
           }
           var currentMessage = messageStore.getById(msgId);
           QB.chat.message.delete(message_id, function(err, message) {
                if (message) {
                  console.log("Deleted message is " + JSON.stringify(message));                
                  messageStore.remove(currentMessage);
                } else  {
                  console.log("Error Deleting User  " + JSON.stringify(err));
                }
                 Ext.Viewport.unmask();
              });
        },

});