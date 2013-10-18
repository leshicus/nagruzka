Ext.define('App.view.AudFieldset', {
    extend:'Ext.form.FieldSet',
    alias:'widget.audfieldset',
    layout: 'fit',
    initComponent:function () {
        console.log('Init AudFieldset');

        this.items = [
                {
                    xtype:'checkboxfield',
                    boxLabel:'ТСО',
                    itemId:'stream-grid-edit-room-tso',
                    name:'tso',  // по этому признаку загружаются данные в форму из грида
                    inputValue:'1'
                },
                {
                    xtype:'container',
                    layout:'hbox',
                    width:'100%',
                    items:[
                        {
                            xtype:'combo',
                            itemId:'stream-grid-edit-room-build',
                            queryMode:'local',
                            editable:false,
                            msgTarget: 'side',
                            multiSelect:false,
                            labelWidth:65,
                            width:115,
                            valueField:'id',
                            displayField:'name',
                            name:'build',
                            fieldLabel:'Корпус',
                            store:'Build'
                        },
                        {
                            xtype:'combo',
                            itemId:'stream-grid-edit-room-level',
                            queryMode:'local',
                            editable:false,
                            msgTarget: 'side',
                            multiSelect:false,
                            margin:'0 0 0 5',
                            labelWidth:35,
                            width:85,
                            valueField:'id',
                            displayField:'name',
                            name:'level',
                            fieldLabel:'Этаж',
                            store:'Level'
                        }
                    ]
                },
                {
                    xtype:'combo',
                    itemId:'stream-grid-edit-room',
                    margin:'5 0 0 0',
                    name:'roomid',
                    valueField:'id',
                    displayField:'name',
                    queryMode:'local',
                    editable:false,
                    msgTarget: 'side',
                    multiSelect:true,
                    labelWidth:65,
                    width:205,
                    fieldLabel:'Аудитории',
                    renderer:Ext.util.Format.comboRenderer('stream-grid-edit-room'),
                    store:'Room'
                }

        ];

        this.callParent(arguments);
        console.log('Init AudFieldset end');
    }


});