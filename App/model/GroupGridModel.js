Ext.define('App.model.GroupGridModel', {
    extend:'Ext.data.Model',
    fields:[
        {
            name:'id',
            mapping:'ID'
        },
        {
            name:'nagId',
            mapping:'NAGID'
        },

        {
            name:'groupId',
            mapping:'GROUPID'
        },
        {
            name:'groupName',
            mapping:'GROUPNAME'
        },

      /*  {
            name:'difCode',
            mapping:'DIFCODE'
        },*/

        {
            name:'typeId',
            mapping:'TYPEID'
        },

        {
            name:'hourAll',
            mapping:'HOURALL'
        },
        {
            name:'hourFact',
            mapping:'HOURFACT'
        },

        {
            name:'subgroup',
            mapping:'SUBGROUP'
        },

        {
            name:'teacherId',
            mapping:'TEACHERID'
        },

        {
            name:'roomId',
            mapping:'ROOMID'
        },
        {
            name:'stream',
            mapping:'STREAM'
        },
        {
            name:'jointDivision',
            mapping:'JOINTDIVISION'
        },
        {
            name:'jointBegin',
            mapping:'JOINTBEGIN'
        },
        {
            name:'jointEnd',
            mapping:'JOINTEND'
        }
    ],
    //store:Ext.create('App.store.HourFact'),
    idProperty:'id'
});
