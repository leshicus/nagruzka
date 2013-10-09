Ext.define('App.view.GroupGrid.HourFact', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.groupgridhourfact',
    itemId:'groupgrid-hourfact',
    queryMode:'local',
    editable:false,
    valueField:'id',
    displayField:'name',

    initComponent:function () {
        console.log('Init GroupGridHourFact');

        this.callParent(arguments);
        console.log('Init GroupGridHourFact end');
    }
});