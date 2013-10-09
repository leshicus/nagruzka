Ext.define('App.store.Build', {
    extend: 'Ext.data.ArrayStore',
    model: 'App.model.ComboModel',
    //autoLoad: true,
    data:[
        {ID:"1", NAME: "1"},
        {ID:"2", NAME: "2"},
        {ID:"3", NAME: "3"}
    ]
});