Ext.define('App.view.GroupGrid.Room', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.groupgridroom',
    itemId:'group-grid-room',
    queryMode:'local',
    editable:false,
    valueField:'id',
    displayField:'name',
    multiSelect: true,

    initComponent:function () {
        console.log('Init GroupGridRoom');

        this.callParent(arguments);
        console.log('Init GroupGridRoom end');
    }
});