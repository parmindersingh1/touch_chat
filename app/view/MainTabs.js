Ext.define('TouchChat.view.MainTabs',{   
       extend: 'Ext.Container',   
       alias: 'widget.mainTabsPanel',
       xtype: 'mainTabsPanel',
       requires: [
        'Ext.TitleBar',
        'Ext.navigation.Bar',
        'Ext.tab.Panel',
        'TouchChat.view.MessageList'
        ],
        config: {          
              layout: {
               type: 'fit'
              },
              items: [
               {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Touch Chat',
                items:[{
                  xtype: 'button',
                  text:  'logout',
                  align: 'right',
                  itemId: 'logoutButton'
                }]
               },
            {
            xtype: 'tabpanel',
            layout: {
             animation: 'slide',
             type: 'card'
            },
            tabBarPosition: 'bottom',
            items: [
                {
                    title: 'Home',
                    iconCls: 'home',
                    itemId: 'homePanel',
                    xtype: 'panel',
                    styleHtmlContent: true,
                    html: [
                       "Welcome to QuickBlox Chat Sencha App"
                    ].join("")
                },
                {
                    title: 'Users',
                    xtype: 'userPanel',
                    iconCls: 'user'
                },
                {
                    title: 'Chats',
                    xtype: 'messagelist',
                    iconCls: 'compose'
                }]
            }]
    }
}); 


