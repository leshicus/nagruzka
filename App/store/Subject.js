Ext.define('App.store.Subject', {
    extend: 'Ext.data.Store',
    model: 'App.model.SubjectComboModel',
    //autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'php/getSubject.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});