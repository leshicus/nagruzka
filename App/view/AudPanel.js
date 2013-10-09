Ext.define('App.view.AudPanel', {
    extend:'Ext.form.Panel',
    alias:'widget.audpanel',
    layout:'fit',
    height:700,
    border:false,

    initComponent:function () {
        console.log('Init audPanel');

        this.items = [
            {
                xtype:'panel',
                layout:'border',
                border:0,
                // margin:'5 5 5 5',
                defaults:{
                    padding:'5 5 5 5'
                },
                items:[
                    {
                        xtype:'panel',
                        region:'center',
                        frame:true,
                        layout:'anchor',
                        margins:'5 5 5 5',
                        itemId:'center-region',
                        items:[
                            {
                                xtype:'groupgrid',
                                anchor:'100%'
                            }
                        ]
                    },
                    {
                        xtype:'panel',
                        title:'Потоки',
                        region:'east',
                        frame:true,
                        margins:'5 5 5 0',
                        width:650,
                        collapsible:true,
                        itemId:'east-region',
                        items:[
                            {
                                xtype:'streamgrid'
                            }
                        ]
                    }
                ]
            }
        ];

        this.callParent(arguments);
        console.log('Init audPanel end');
    }


});