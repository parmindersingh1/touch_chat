Ext.define('TouchChat.view.MainTabs',{   
       extend: 'Ext.tab.Panel',   
       xtype: 'mainTabs',   
       requires: [
        'Ext.TitleBar',
        'Ext.navigation.Bar',
        'TouchChat.util.Config'
    ],
    config: {
        tabBarPosition: 'bottom',
        items: [
            {
                title: 'Home',
                iconCls: 'home',
                itemId: 'homePanel',
                xtype: 'panel',
               styleHtmlContent: true,
               html: [
                   "Wlcome to QuickBlox Chat Sencha App"
               ].join("")
            },
            {
                title: 'Users',
                xtype: 'userPanel',
                iconCls: 'user'
            }]
    }
}); 


