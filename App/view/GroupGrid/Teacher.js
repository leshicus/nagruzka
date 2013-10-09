Ext.define('App.view.GroupGrid.Teacher', {
    extend:'Ext.form.field.ComboBox',
    alias:'widget.groupgridteacher',
    itemId:'group-grid-teacher',
    queryMode:'local',
    editable:false,
    //multiSelect: true,
    valueField:'id',
    displayField:'name',

    initComponent:function () {
        console.log('Init GroupGridTeacher');

        this.callParent(arguments);
        console.log('Init GroupGridTeacher end');
    }
});