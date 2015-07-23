Ext.define('TouchChat.view.MessageList', {
	extend: 'Ext.dataview.List',

	xtype: 'messagelist',
	
	config: {
		disableSelection: true,
		title: 'Sencha Touch Chat',
		store: 'Messages',

		itemTpl : new Ext.XTemplate(
			'<tpl if="local">',
			'	<div class="nick local">{login}</div>',
			'   <input type="button" name="{id}" value="Delete" ', 
            '   style="padding:3px;">',
			'	<div class="x-button x-button-confirm local"">',
			'		<p class="x-button-label message">{message}</p>',
			'	</div>',
			'<tpl else>',
			'	<div class="nick remote">{login}</div>',
			'	<div class="x-button remote"">',
			'		<p class="x-button-label message">{message}</p>',
			'	</div>',
			'</tpl>'
		),

		items: [{
			xtype: 'toolbar',
			docked: 'bottom',
			items: [
				{
					xtype: 'textareafield',
					height: 60,
					flex: 5,
					name: 'message',
					itemId: 'messageBody'
				}, {
					xtype: 'button',
					itemId: 'sendMessage',
					ui: 'action',
					flex: 1,
					text: 'Send'
				}
			]
		}]
	}
});