Ext.define('App.store.Type', {
    extend: 'Ext.data.Store',
    model: 'App.model.ComboModel',
    data:[
        {id:"1", name: "Лек"},
        {id:"2", name: "Лаб"},
        {id:"3", name: "Сем"},
        {id:"4", name: "КП"},
        {id:"5", name: "КР"},
        {id:"6", name: "ГЭ"}
    ]
});