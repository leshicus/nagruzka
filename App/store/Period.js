Ext.define('App.store.Period', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',
    
    proxy: {
        type: 'rest',
        url: 'php/getPeriod.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
    //,autoLoad: true
});