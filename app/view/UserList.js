Ext.define('TouchChat.view.UserList', {
    extend: 'Ext.dataview.List',
    xtype : 'userPanel',
     
    config: {
     store : 'UserStore',
      
     itemTpl: '<div class="myButton">' +
        '<input type="button" name="{id}" value="Delete" ' +
        'style="padding:3px;">' +
        '</div>' +
        '<div class="myContent">'+ 
        '<div> <b>{login}</b></div>' +
        '</div>'
     
    } 
});