Ext.define('TouchChat.model.Message', {
	extend: 'Ext.data.Model',

	config: {
		idProperty: 'id',
		fields: [
			{
				name: 'id',
				type: 'integer'
			},
			{
				name: 'local',
				type: 'boolean'
			}, {
				name: 'login',
				type: 'string'
			}, {
				name: 'message',
				type: 'string'
			}
		]
	}
});