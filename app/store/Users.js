Ext.define('TouchChat.store.Users', {
    extend: 'Ext.data.Store',
     
    config: {
     model: 'TouchChat.model.User',
     storeId: 'UserStore',
     // autoLoad: true,
      
   //   proxy: {
   //       type: 'ajax',
   //       url: 'CountryServlet',
   //       reader: {
   //           type: 'json',
   //           totalProperty: 'totalCount',
   //           rootProperty: 'countries',
   //           successProperty: 'success'
   //       },
   // }
    }
});