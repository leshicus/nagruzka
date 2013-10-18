Ext.define('App.store.Week', {
    extend: 'Ext.data.ArrayStore',
    model: 'App.model.ComboModel',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'php/getWeek.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});