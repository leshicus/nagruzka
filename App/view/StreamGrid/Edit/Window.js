Ext.define('App.view.StreamGrid.Edit.Window', {
    extend:'Ext.Window',
    alias:'widget.streamgrideditwindow',
    itemId:'stream-grid-edit-window',

    frame:true,
    title: 'Редактирование потока',
    width: 445,
    maxHeight: 400,
    minHeight: 200,
    layout: 'fit',
    initComponent:function () {
        console.log('Init StreamGridEditWindow');

        this.callParent(arguments);
        console.log('Init StreamGridEditWindow end');
    }
});