Ext.define('App.store.Teacher', {
    extend: 'Ext.data.Store',
    model: 'App.model.TeacherComboModel',
    
    proxy: {
        type: 'rest',
        url: 'php/getTeacher.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
});