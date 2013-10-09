Ext.define('App.store.Division', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'php/getDivision.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});