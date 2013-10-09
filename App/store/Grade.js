Ext.define('App.store.Grade', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',
   //autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'php/getGrade.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});