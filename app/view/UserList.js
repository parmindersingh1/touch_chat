Ext.define('TouchChat.view.UserList', {
    extend: 'Ext.dataview.List',
    xtype : 'userPanel',
     requires: [
        'TouchChat.view.Main',       
        'TouchChat.util.Config',
        'TouchChat.util.LoginHelper'
    ], 
    config: {
     store : 'UserStore',
      
     itemTpl: '<tpl if="LoginHelper.getUser().id !== id"'+
        '<div class="myButton">' +
        '<input type="button" name="{id}" value="Delete" ' +
        'style="padding:3px;">' +
        '</div>' +
        '</tpl>'+
        '<div class="myContent">'+ 
        '<div> <b>{login}</b></div>' +
        '</div>'
     
    } 
});