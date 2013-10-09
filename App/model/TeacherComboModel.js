Ext.define('App.model.TeacherComboModel', {
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
            name:'divId',
            mapping:'DIVID'
        },

        {
            name:'fioFull',
            mapping:'FIO_FULL'
        },

        {
            name:'job',
            mapping:'JOB'
        }
    ]
});