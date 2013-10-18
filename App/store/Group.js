Ext.define('App.store.Group', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',

    proxy: {
        type: 'rest',
        url: 'php/getGroup.php?' + tablesPhpStream,
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
    //,autoLoad: true
});