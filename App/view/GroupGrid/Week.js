Ext.define('App.view.GroupGrid.Week', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.groupgridweek',
    itemId:'group-grid-week',
    queryMode:'local',
    editable:false,
    valueField:'id',
    displayField:'name',

    initComponent:function () {
        console.log('Init GroupGridWeek');

        this.callParent(arguments);
        console.log('Init GroupGridWeek end');
    }
});