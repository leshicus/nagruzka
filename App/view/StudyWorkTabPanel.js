Ext.define('App.view.StudyWorkTabPanel', {
    extend:'Ext.tab.Panel',
    alias:'widget.studyworktabpanel',
    activeTab: 0,
    frame:true,
    padding:'0 0 0 0',

    initComponent:function () {
        console.log('Init StudyWorkTabPanel');

        this.items = [
            {
                itemId:'auditorium-tab',
                title: 'Аудиторная',
                items:[
                    {
                        xtype: 'audpanel',
                        width: '100%'
                    }
                ]
            },
            {
                itemId:'no-auditorium-tab',
                title: 'Внеаудиторная',
                items:[
                   /* {
                        xtype: 'noaudpanel',
                        width: '100%'
                    }*/
                ]
            },
            {
                itemId:'other-types-tab',
                title: 'Другие виды'
            }
        ];

        this.callParent(arguments);
        console.log('Init StudyWorkTabPanel end');
    }
});