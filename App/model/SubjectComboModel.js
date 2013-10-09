Ext.define('App.model.SubjectComboModel', {
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
            name:'grade',
            mapping:'GRADE'
        },
        {
            name:'divId',
            mapping:'DIVID'
        },
        {
            name:'nagId',
            mapping:'NAGID'
        }
    ],
    idProperty:'nagId'
});