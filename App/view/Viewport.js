Ext.define('App.view.Viewport', {
    extend:'Ext.container.Viewport',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    alias:'widget.viewport',
    defaults:{
        border:false,
        padding:'5 5 5 5'
    },
    initComponent:function () {
        console.log('Init Viewport');

        this.items = [
            {
                xtype:'panel',
                title:'Учебная нагрузка',
                frame:true,
                items:[
                    {
                        xtype:'container',
                        layout: 'hbox',
                        margin:'0 5 0 5',
                        items:[
                            {
                                xtype:'container',
                                layout: 'vbox',
                                margin:'0 5 0 5',
                                defaults:{
                                    width:550
                                },
                                items:[
                                    {
                                        fieldLabel:'Кафедра',
                                        xtype:'combo',
                                        queryMode:'local',
                                        //readOnly:true,
                                        editable:false,
                                        forceFit:true,
                                        valueField:'id',
                                        //value:divName,
                                        displayField:'name',
                                        name:'division',
                                        itemId:'division',
                                        store:'Division'
                                    },
                                    {
                                        fieldLabel:'Период',
                                        xtype:'combo',
                                        forceFit:true,
                                        queryMode:'local',
                                        editable:false,
                                        valueField:'id',
                                        displayField:'name',
                                        name:'period',
                                        itemId:'period',
                                        store:Ext.create('App.store.Period')
                                    },
                                    {
                                        fieldLabel:'Курс',
                                        xtype:'combo',
                                        queryMode:'local',
                                        editable:false,
                                        valueField:'id',
                                        displayField:'name',
                                        name:'grade',
                                        itemId:'grade',
                                        store:Ext.create('App.store.Grade')
                                    },
                                    {
                                        fieldLabel:'Предмет',
                                        xtype:'combo',
                                        queryMode:'local',
                                        editable:false,
                                        align:'left',
                                        valueField:'id',
                                        displayField:'name',
                                        name:'subject',
                                        itemId:'subject'
                                        //store:Ext.create('App.store.Subject')
                                    }
                                ]
                            },
                            {
                                xtype:'audfieldset',
                                title: 'Подбор аудитории',
                                layout: 'anchor',
                                width:220,
                                height:103,
                                padding:'6px'
                            }
                        ]
                    },
                    {
                        xtype:'studyworktabpanel',
                        width:'100%'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});