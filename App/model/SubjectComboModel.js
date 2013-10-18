Ext.define('App.model.SubjectComboModel', {
    extend:'Ext.data.Model',
    fields:[
        {name:'id'},
        {name:'name'},
        {name:'grade'},
        {name:'divid'},
        {name:'nagid'}
    ],
    idProperty:'nagid'  // * явное указание что только nagid уникален,
    // иначе теряется id=1113 (базы данных для 2 и 3 курсов- предмет, который читают на разных курсах)
});