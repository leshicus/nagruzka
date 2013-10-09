Ext.define('App.store.Level', {
    extend: 'Ext.data.ArrayStore',
    model: 'App.model.LevelComboModel',
    //autoLoad: true,
    data:[
        {ID:"1", NAME: "1", BUILD:["1", "2", "3"]},
        {ID:"2", NAME: "2", BUILD:["1", "2", "3"]},
        {ID:"3", NAME: "3", BUILD:["1", "2", "3"]},
        {ID:"4", NAME: "4", BUILD:["1", "2", "3"]},
        {ID:"5", NAME: "5", BUILD:["1", "2", "3"]},
        {ID:"6", NAME: "6", BUILD:["1", "2", "3"]},
        {ID:"7", NAME: "7", BUILD:["1", "2", "3"]},
        {ID:"8", NAME: "8", BUILD:["1", "2", "3"]},
        {ID:"9", NAME: "9", BUILD:["3"]},
        {ID:"10", NAME: "10", BUILD:["3"]},
        {ID:"11", NAME: "Ц", BUILD:["1", "2"]},
        {ID:"12", NAME: "П", BUILD:["1"]}
    ]
});