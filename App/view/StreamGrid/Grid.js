Ext.define('App.view.StreamGrid.Grid', {
    extend:'Ext.grid.Panel',
    alias:'widget.streamgrid',
    itemId:'stream-grid',
    frame:true,
    //forceFit: true,
    //flex:1,
    title:'Потоки',
    width:700,
    margin: '5 5 5 0',
    columnLines:true,
    viewConfig:{
        plugins:{
            ptype:'gridviewdragdrop',
            ddGroup:'GridExample',
            enableDrag:false
        },
        // подсвечивает строчку в гриде с ТСО желтым цветом
        getRowClass: function(record) {
            if(!record) return '';
            // скрыть какие-то строчки в гриде, но в сторе они будут (типа фильтра)
            //if(record.data.level == "2") return 'x-hide-display';
            if(record.data.tso == "1") return 'bg-yellow';
        }
    },
    draggable:false,
    initComponent:function () {
        console.log('Init StreamGrid');

        this.store = Ext.create('App.store.StreamGrid.Grid');
        //this.subjectStore = Ext.create('App.store.Subject');

        this.tbar = [
            {
                text:'Добавить',
                action:'create',
                iconCls: 'icon_add'
            },'-',
            {
                text:'Удалить',
                action:'delete',
                iconCls: 'icon_delete'
            }
        ];

        this.columns = [
            {
                xtype:'rownumberer',
                text:'№',
                width:30
            },
            {
                text:'Поток',
                dataIndex:'stream',
                width:70,
                align: 'center'
            },
            {
                text:'Тип',
                dataIndex:'typeid',
                width:50,
                renderer:streamGridColumnRenderer
            },
            {
                text:'Предмет',
                dataIndex:'subjectid',
                //width:200,
                flex:1,
                renderer:streamGridColumnRenderer
            },
            {
                text:'Группа',
                dataIndex:'groupid',
                width:90,
                renderer:streamGridColumnRenderer
            },
            {
                text:'Преподаватель',
                dataIndex:'teacherid',
                width:120,
                renderer:streamGridColumnRenderer
            },
            {
                text:'Аудитория',
                dataIndex:'roomid',
                width:80,
                renderer:streamGridColumnRenderer
            }
        ];

        //this.groupStore = this.getGroupStore();

        this.callParent(arguments);
        console.log('Init StreamGrid end');
    },

/*    getGroupStore:function () {
        *//*var studyId = this.getBubbleTarget().up('viewport').query('#period')[0].getValue(),
            divId = App.app.getController('Main').getViewport().query('#division')[0].getValue();
*//*
        var store = Ext.create('App.store.StreamGrid.Edit.Group');
        //store.load();
        return store;
    },*/

    // отмеченная ячейка
    getSelected:function () {
        var sm = this.getSelectionModel();
        var rs = sm.getSelection();
        if (rs.length) {
            return rs[0];
        }
        return null;
    },

    DeleteRow:function () {
        Ext.Msg.confirm('Удаление потока', 'Удалить поток?', function (button) {
            if (button == 'yes') {
                var selection = this.getSelected();
                this.store.remove(selection);
            }
        }, this);
    },

    // сравнение двух массивов, выводит разницу
    compareArrays:function(groupArray, formGroupArr){
        // упростим массивы до и после
        var arrBefore = [],
            arrAfter = [],
            arrDelta = [];
        // сравним массивы групп до и после
        for(var i in groupArray){
            arrBefore.push(groupArray[i]);
        }

        for(var i in formGroupArr){
            arrAfter.push(formGroupArr[i]);
        }

        for(var i in arrBefore){
            if(arrAfter.indexOf(arrBefore[i]) == -1){
                arrDelta.push(arrBefore[i]);
            }
        }

        return arrDelta;
    }

});