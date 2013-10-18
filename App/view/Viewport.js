Ext.define('App.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    alias: 'widget.viewport',
    defaults: {
        border: false
    },
    initComponent: function () {
        console.log('Init Viewport');

        this.items = [
            {
                layout: 'hbox',
                items: [
                    {
                        layout: 'vbox',
                        padding: '5 5 0 5',
                        defaults: {
                            xtype: 'combo',
                            width: 550,
                            editable: false,
                            queryMode: 'local',
                            valueField: 'id',
                            displayField: 'name'
                        },
                        items: [
                            {
                                fieldLabel: 'Кафедра',
                                name: 'division',
                                itemId: 'division',
                                store: 'Division'
                            },
                            {
                                fieldLabel: 'Период',
                                name: 'period',
                                itemId: 'period',
                                store: Ext.create('App.store.Period')
                            },
                            {
                                fieldLabel: 'Курс',
                                name: 'grade',
                                itemId: 'grade',
                                store: 'Grade'
                            },
                            {
                                fieldLabel: 'Предмет',
                                name: 'subject',
                                itemId: 'subject',
                                store: Ext.create('App.store.Subject')
                            }
                        ]
                    },
                    {
                        xtype: 'audfieldset',
                        title: 'Подбор аудитории',
                        layout: 'anchor',
                        width: 220,
                        height: 115,
                        padding: '6px'
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                flex: 1,
                frame: true,
                items: [
                    {
                        itemId: 'auditorium-tab',
                        title: 'Аудиторная',
                        cls: 'ContentPanel',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'

                        },
                        items: [
                            {
                                xtype: 'groupgrid'
                            },
                            {
                                xtype: 'streamgrid'
                            }
                        ]
                    },
                    {
                        itemId: 'no-auditorium-tab',
                        title: 'Внеаудиторная'
                    },
                    {
                        itemId: 'other-types-tab',
                        title: 'Другие виды'
                    }
                ]
            }
        ];
        this.callParent(arguments);
    }
});