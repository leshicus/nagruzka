Ext.define('App.model.ComboModel',{
    extend: 'Ext.data.Model',
    fields: [
    {
        name: 'id',   
        mapping: 'ID'
    },

    {
        name: 'name', 
        mapping: 'NAME'
    }
    ]
});