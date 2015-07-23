Ext.define('TouchChat.model.User', {
    extend: 'Ext.data.Model',
    config: {
     idProperty: 'id',
     fields: [              
              {
              	name: 'id',
	            type: 'integer'
	       	  },
	       	  {
              	name: 'owner_id',
	            type: 'string'
	       	  },
	       	  {
              	name: 'full_name',
	            type: 'string'
	       	  },
	       	  {
              	name: 'email',
	            type: 'string'
	       	  },
	       	  {
              	name: 'login',
	            type: 'string'
	       	  },
             ]
    }
});