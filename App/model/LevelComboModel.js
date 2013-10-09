Ext.define('App.model.LevelComboModel', {
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
        }
    ]
});