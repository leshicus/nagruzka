Ext.define('App.store.GroupGrid.Grid', {
    extend: 'Ext.data.Store',
    model: 'App.model.GroupGridModel',
    groupField:'groupName',
    /*getGroupString: function(instance) {
        if(instance.get('difCode')){
            var group = instance.get('groupName') + " (" + instance.get('difCode') + ")";
        }else{
            var group = instance.get('groupName');
        }
        return group;
    },*/
    sorters:['groupName', 'typeId'],
    autoSync: true,
 	proxy: {
		type: 'ajax',
		api: {
			create: 'php/GroupGrid/syncGrid.php?act=create&' + tablesPhpStream,
			read: 'php/GroupGrid/syncGrid.php?act=read&' + tablesPhpStream,
            update: 'php/GroupGrid/syncGrid.php?act=update&' + tablesPhpStream,
			destroy: 'php/GroupGrid/syncGrid.php?act=destroy&' + tablesPhpStream
		},
		reader: {
			type: 'json',
			root: 'rows'
		},
		writer: {
			type: 'json'
		},
        appendId: false,
        actionMethods: {
             create : 'POST',
             read   : 'POST',
             update : 'POST',
             destroy: 'POST'
        }
	},
    initComponent:function () {

    }
});