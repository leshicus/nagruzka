Ext.define('App.store.Room', {
    extend: 'Ext.data.Store',
    model: 'App.model.RoomComboModel',
    
    proxy: {
        type: 'rest',
        url: 'php/getRoom.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    }
    //,autoLoad: true
});