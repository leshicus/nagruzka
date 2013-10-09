Ext.define('App.view.StreamGrid.Edit.Form', {
    extend:'Ext.form.Panel',
    alias:'widget.streamgrideditform',
    itemId:'stream-grid-edit-form',
    height:300,
    frame:true,
    bodyPadding: 5,
    //layout: 'anchor',
    defaults: {
        anchor: '100%',
        valueField:'id',
        displayField:'name'
    },
    fieldDefaults: {
        queryMode:'local',
        editable:false,
        //allowBlank: false,
        msgTarget: 'side'/*,
        afterLabelTextTpl: required*/
    },
    defaultType: 'combo',
// todo VPGroup: обработка совместного ведения предметов.
    constructor: function(){
        console.log('Init StreamGridEditForm');

        var viewport = App.app.getController('Main').getViewport(),
            grid = viewport.down('streamgrid'),
            typeStore = viewport.typeStore,
            subjectStore = grid.subjectStore,
            teacherStore = grid.teacherStore;


        this.items= [
            {
                itemId:'stream-grid-edit-stream',
                name: 'stream',
                hidden:true
            },
            {
                itemId:'stream-grid-edit-type',
                name: 'typeId',
                store:typeStore,
                fieldLabel:'Тип',
                allowBlank:false,
                renderer: Ext.util.Format.comboRenderer('stream-grid-edit-type')
            },
            {
                itemId:'stream-grid-edit-subject',
                name: 'subjectId',
                store:subjectStore,
                fieldLabel:'Предмет',
                allowBlank:false,
                renderer: Ext.util.Format.comboRenderer('stream-grid-edit-subject')
            },
            {
                itemId:'stream-grid-edit-teacher',
                name: 'teacherId',
                padding: '5 0 0 0',
                store:teacherStore,
                multiSelect: true,
                fieldLabel:'Преподаватели',
                allowBlank:false,
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
                        xtype:'fieldset',
                        title: 'Группы',
                        layout: 'anchor',
                        height:150,
                        width:300,
                        margin: '0 0 0 5',
                        flex:1,
                        items :[
                            {
                                xtype:'gridpanel',
                                itemId:'edit-form-group-grid',
                                store: Ext.create('Ext.data.Store',{
                                    model:'App.model.FormGroupGridModel',
                                    sorters:['groupId']
                                }),
                                //store: Ext.create('App.store.StreamGrid.Edit.GridGroup'),
                                height:120,
                                fieldLabel:'Группы',
                                columnLines:true,
                                columns:[
                                    {
                                        text: 'Группы',
                                        dataIndex:'groupId',
                                        width: 80,
                                        renderer:editFormGroupGridColumnRenderer
                                    },
                                    //{text: 'Собственный предмет', dataIndex:'groupName', flex:1},
                                    {
                                        text: 'Удалить',
                                        xtype: 'actioncolumn',
                                        width:60,
                                        align:'center',
                                        sortable: false,
                                        items: [{
                                            icon: '/ext-4.2.1/examples/shared/icons/fam/delete.gif',
                                            tooltip: 'Удалить из потока'
                                        }]
                                    }
                                ]
                            }
                        ]
                    }

                ]
            }
        ];


        /*var type = this.query('#stream-grid-edit-type')[0],
         grid = this.query('#edit-form-group-grid')[0]*/;

        /*if (grid.store.length) {
         type.setReadOnly(true);
         }*/
        // todo доделать

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