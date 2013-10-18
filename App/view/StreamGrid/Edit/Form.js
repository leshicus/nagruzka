Ext.define('App.view.StreamGrid.Edit.Form', {
    extend:'Ext.form.Panel',
    alias:'widget.streamgrideditform',
    itemId:'stream-grid-edit-form',
    bodyPadding: 5,
    defaults: {
        anchor: '100%',
        valueField:'id',
        displayField:'name'
    },
    fieldDefaults: {
        queryMode:'local',
        editable:false
        //msgTarget: 'side',
    },
    defaultType: 'combo',
// todo VPGroup: обработка совместного ведения предметов.
    constructor: function(){
        console.log('Init StreamGridEditForm');

        var viewport = App.app.getController('Main').getViewport(),
            grid = viewport.down('streamgrid'),
            typeStore = Ext.data.StoreManager.lookup('Type'),
            subjectStore = Ext.create('App.store.Subject'),
            teacherStore = Ext.create('App.store.Teacher');
        subjectStore.load({
            params: {
                studyId: Ext.ComponentQuery.query('#period')[0].getValue(),
                divid: Ext.ComponentQuery.query('#division')[0].getValue()
            }
        });
        teacherStore.load({
            params: {
                divid: Ext.ComponentQuery.query('#division')[0].getValue()
            }
        });


        this.items= [
            {
                itemId:'stream-grid-edit-stream',
                name: 'stream',
                hidden:true
            },
            {
                itemId:'stream-grid-edit-type',
                name: 'typeid',
                store:typeStore,
                fieldLabel:'Тип',
                allowBlank:false,
                afterLabelTextTpl: required,
                renderer: Ext.util.Format.comboRenderer('stream-grid-edit-type')
            },
            {
                itemId:'stream-grid-edit-subject',
                name: 'subjectid',
                store:subjectStore,
                fieldLabel:'Предмет',
                allowBlank:false,
                afterLabelTextTpl: required,
                renderer: Ext.util.Format.comboRenderer('stream-grid-edit-subject')
            },
            {
                itemId:'stream-grid-edit-teacher',
                name: 'teacherid',
                padding: '5 0 0 0',
                store:teacherStore,
                multiSelect: true,
                fieldLabel:'Преподаватели',
                allowBlank:false,
                afterLabelTextTpl: required,
                renderer: Ext.util.Format.comboRenderer('stream-grid-edit-teacher')
            },
            {
                xtype:'container',
                layout: 'hbox',
                width: '100%',
                margin: '5 5 5 5',
                defaults: {
                    padding: '5 5 5 5'
                },
                items:[
                    {
                        xtype:'audfieldset',
                        title: 'Аудитории',
                        layout: 'anchor',
                        width:220,
                        height:150
                    },
                    {
                        xtype:'gridpanel',
                        itemId:'edit-form-group-grid',
                        store: Ext.create('Ext.data.Store',{
                            model:'App.model.FormGroupGridModel',
                            sorters:['groupid']
                        }),
                        margin: '0 0 0 5',
                        padding:'5 0 0 0',
                        flex:1,
                        columnLines:true,
                        columns:[
                            {
                                text: 'Группы',
                                dataIndex:'groupid',
                                flex:1,
                                menuDisabled:true,
                                renderer:editFormGroupGridColumnRenderer
                            },
                            {
                                text: 'Удалить',
                                xtype: 'actioncolumn',
                                width:60,
                                menuDisabled:true,
                                items: [{
                                    icon: '/ext-4.2.1/examples/shared/icons/fam/delete.gif',
                                    tooltip: 'Удалить из потока'
                                }]
                            }
                        ]
                    }
                ]
            }
        ];

        this.buttons =  [{
            text: 'ОК',
            action: 'save'
        },'->',
        {
            text: 'Отмена',
            action: 'cancel'
        }];

        this.callParent(arguments);
        console.log('Init StreamGridEditForm end');
    }
});