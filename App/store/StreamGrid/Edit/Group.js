Ext.define('App.store.StreamGrid.Edit.Group', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',

    proxy: {
        type: 'rest',
        url: 'php/StreamGrid/Edit/getGroup.php?' + tablesPhpStream,
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
    //,autoLoad: true
});