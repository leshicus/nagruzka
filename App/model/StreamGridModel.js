Ext.define('App.model.StreamGridModel', {
    extend:'Ext.data.Model',
    fields:[
        {name:'stream'},
        {name:'typeid'},
        {name:'subjectid'},
        {name:'groupid'},
        {name:'nagid'},
        {name:'raspredid'},
        {name:'teacherid'},
        {name:'roomid'},
        {name:'tso'},
        {name:'build'},
        {name:'level'},
        {name:'deleted_nagid'}
    ]
});