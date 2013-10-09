Ext.define('App.model.RoomComboModel', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            mapping:'ID'
        },

        {
            name:'name',
            mapping:'NAME'
        },
        {
            name:'build',
            mapping:'BUILD'
        },
        {
            name:'level',
            mapping:'LVL'
        },
        {
            name:'tso',
            mapping:'TSO'
        }
    ]
});