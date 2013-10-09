Ext.define('App.store.Type', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',
    
    proxy: {
        type: 'rest',
        url: 'php/getType.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
    ,autoLoad: true
});