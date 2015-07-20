Ext.define('TouchChat.model.Login', {
	extend: 'Ext.data.Model',

	config: {
		fields: [
			{
				name: 'login',
				type: 'string'
			}, {
				name: 'password',
				type: 'string'
			}
		],validations: [{
            type: 'presence',
            field: 'login',
            message: "Name is required"
        }, {
            type: 'length',
            field: 'login',
            min: 3,
            max: 50,
            message: "Name should be between 3 and 50 characters"
        },{
            type: 'presence',
            field: 'password',
            message: "Password is required"
        }, {
            type: 'length',
            field: 'password',
            min: 5,
            max: 25,
            message: "Password should be between 5 and 25 characters"
        }]
	}
});