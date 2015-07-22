Ext.define('TouchChat.controller.LoginController', {
	extend: 'Ext.app.Controller',

    requires: [
        'Ext.Toast',
        'TouchChat.view.Main',       
        'TouchChat.util.Config',
        'TouchChat.view.MainTabs',
        'TouchChat.util.LoginHelper'
    ],

    config: {
        refs: {
            mainView: 'mainView',
            mainTabs: 'mainTabsPanel',
            loginForm: 'loginForm',
            registerForm: 'registerForm',
            loginButton: 'loginForm #loginButton',
            registerButton: 'registerForm #registerButton',
            showLogin: 'mainView #showLoginButton',
            showSignUp: 'mainView #showSignupButton'

        },
        control: {
            loginButton : {
                tap: 'onLoginButtonTap'
            },
            registerButton: {
                tap: 'onRegisterButtonTap'
            },
            showLogin : {
                tap: 'showLoginForm'
            },
            showSignUp: {
                tap: 'showSignUpForm'
            }
        }
    },
    launch: function() {
    var me = this;        
        Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Loading...'
                });
            
        QB.init(Config.config.qbApp.appID, Config.config.qbApp.authKey, Config.config.qbApp.authSecret, Config.config.qbApp.debug);
        QB.createSession(function(err, result) {
          if (err) { 
            Ext.Msg.alert('Something went wrong: ' + err.message);
             Ext.Viewport.unmask();
          } else {
            console.log('Session created with id ' + result.id);
            me.session_id = result.id;
            me.populateUsers();
            var user = LoginHelper.getUser();
            console.log(user);
            if(user){
                me.autoLogin(user);
            }
            Ext.Viewport.unmask();  
          }
        });
       
    },  
    showLoginForm: function(button, e, eOpts){      
       var mainView = this.getMainView();
        mainView.push({
                        itemId: 'loginForm',
                        xtype: "loginForm",
                        title: "Login"
                    });


    },
    showSignUpForm: function(button, e, eOpts){
        var mainView = this.getMainView();
        mainView.push({
                        itemId: 'registerForm',
                        xtype: "registerForm",
                        title: "Sign Up"
                    });
    },
    onLoginButtonTap: function(button, e, eOpts){
        var login = Ext.create("TouchChat.model.Login", {});
        var loginForm = button.up('formpanel'); // Login form
        var values = loginForm.getValues(); // Form values
        loginForm.updateRecord(login);
        console.log(values);
        var me = this;
        var validationObj = login.validate();
        if (!validationObj.isValid()) {
            var errorString = this.handleLoginFormValidation(validationObj);
            Ext.Msg.alert("Oops", errorString);
        } else {
            Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Signing in...'
                });
            console.log(values);
            var params = {
                login: values.login,
                password: values.password
            }
            QB.login(params, function(err, user){
              if (user) {
                console.log("User logged in Succesfully "+ user);
                user.password = values.password;
                LoginHelper.setUser(user);
               Ext.Viewport.unmask();
                
                // TouchChat.app.getController('AccountController').connectChat(user);
                // TouchChat.app.getController('AccountController').createRoom(user);
                me.showMainTabs();
              } else  {
                console.log("log in Failure " + err.message);
                Ext.Msg.alert(err.message);
              }
              
            });
        }
    },
    onRegisterButtonTap: function(button, e, eOpts){
        var me = this;
        var mainView = this.getMainView();        
        var userStore = Ext.getStore('UserStore');
        var register = Ext.create("TouchChat.model.Register", {});
        var registerForm = button.up('formpanel'); // Register form
        var values = registerForm.getValues(); // Form values
        registerForm.updateRecord(register);
        console.log(values);
        var validationObj = register.validate();
        if (!validationObj.isValid()) {
            var errorString = this.handleRegisterationFormValidation(validationObj);
            Ext.Msg.alert("Oops", errorString);
        } else {
              Ext.Viewport.mask({
                    xtype: 'loadmask',
                    indicator: true,
                    message: 'Signing up...'
                });
            var newUser = {
                login: values.login,
                email: values.email,
                password: values.password
            }
          QB.users.create(newUser, function(err, result) {
          // callback function
           if(result){
               console.log("successfully Created User " + result);
               userStore.add(result);   
               mainView.pop();
            }else  {
                Ext.Msg.alert("Error Creating User " + err.messsage );             
            }
            Ext.Viewport.unmask();
        });
        }
    },
     handleLoginFormValidation: function(validationObj) {
        var errorString = "";
        var errorCounted = 0;
        var totalErrors = 0;

        var emailErrors = validationObj.getByField('login');
        if (emailErrors != null && emailErrors.length > 0) {
            if(errorCounted < 3) {
                errorString += emailErrors[0].getMessage() + "<br>";
                errorCounted = errorCounted + 1;
            }
            totalErrors = totalErrors + emailErrors.length;
            var field = Ext.ComponentQuery.query('#loginScreenUser');
            field[0].addCls('error');
        }

        var passwordErrors = validationObj.getByField('password');
        if (passwordErrors != null && passwordErrors.length > 0) {
            if(errorCounted < 3) {
                errorString += passwordErrors[0].getMessage() + "<br>";
                errorCounted = errorCounted + 1;
            }
            totalErrors = totalErrors + passwordErrors.length;
            var field = Ext.ComponentQuery.query('#loginScreenPassword');
            field[0].addCls('error');
        }
                
        if(totalErrors > 3) {
            errorString += ".... more errors"
        }
        return errorString;
    },
     handleRegisterationFormValidation: function(validationObj) {
        var errorString = "";
        var errorCounted = 0;
        var totalErrors = 0;

        var emailErrors = validationObj.getByField('email');
        if (emailErrors != null && emailErrors.length > 0) {
            if(errorCounted < 3) {
                errorString += emailErrors[0].getMessage() + "<br>";
                errorCounted = errorCounted + 1;
            }
            totalErrors = totalErrors + emailErrors.length;
            var field = Ext.ComponentQuery.query('#registerScreenEmail');
            field[0].addCls('error');
        }

        var passwordErrors = validationObj.getByField('password');
        if (passwordErrors != null && passwordErrors.length > 0) {
            if(errorCounted < 3) {
                errorString += passwordErrors[0].getMessage() + "<br>";
                errorCounted = errorCounted + 1;
            }
            totalErrors = totalErrors + passwordErrors.length;
            var field = Ext.ComponentQuery.query('#registerScreenPassword');
            field[0].addCls('error');
        }

        var nameErrors = validationObj.getByField('login');
        if (nameErrors != null && nameErrors.length > 0) {
            if(errorCounted < 3) {
                errorString += nameErrors[0].getMessage() + "<br>";
                errorCounted = errorCounted + 1;
            }
            totalErrors = totalErrors + nameErrors.length;
            var field = Ext.ComponentQuery.query('#registerScreenUser');
            field[0].addCls('error');
        }

        if(totalErrors > 3) {
            errorString += ".... more errors"
        }
        return errorString;
    },
    populateUsers: function() {
        var userStore = Ext.getStore('UserStore');
        userStore.removeAll();
        QB.users.listUsers(function(err, result) {
            if(result){
                for (var i=0; i < result.items.length; i++) {
                console.log('User ' + result.items[i].user.login + ' is registered');
                userStore.add(result.items[i].user);
              }
              console.log('Number of Users after adding : ' + userStore.getCount());
            } else  {
               Ext.Msg.alert("Error Loading Users " + err.message );             
            }
         });

    },
    showMainTabs: function(){
        // var mainTabs = Ext.ComponentQuery.query('#mainTabsPanel');       
        var mainTabs = Ext.create('TouchChat.view.MainTabs',{
            itemId: 'mainTabsPanel'
        })
        Ext.Viewport.setActiveItem(mainTabs);
        // mainTabs.setActiveItem('mainTabsPanel #homePanel');
    },
    autoLogin: function(params){
        console.log(params);
         var me = this;
        QB.login(params, function(err, user){
              if (user) {
                console.log("User logged in Succesfully "+ user);               
                // TouchChat.app.getController('AccountController').connectChat(user);
                me.showMainTabs();
              } else  {
                console.log("log in Failure " + JSON.stringify(err));
                Ext.Msg.alert(err.message);
              }
              
               Ext.Viewport.unmask();
            });
    }
});