Ext.define('TouchChat.model.User', {
    extend: 'Ext.data.Model',
    config: {
     fields: [              
              {
              	name: 'id',
	            type: 'string'
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