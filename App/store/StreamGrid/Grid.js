Ext.define('App.store.StreamGrid.Grid', {
    extend:'Ext.data.Store',
    model:'App.model.StreamGridModel',
    sorters:'name',
    autoSync:true,
    proxy:{
        type:'ajax',
        api:{
            read:'php/StreamGrid/syncGrid.php?act=read&' + tablesPhpStream,
            destroy:'php/StreamGrid/syncGrid.php?act=destroy&' + tablesPhpStream,
            create:'php/StreamGrid/syncGrid.php?act=create&' + tablesPhpStream,
            update:'php/StreamGrid/syncGrid.php?act=update&' + tablesPhpStream
        },
        reader:{
            type:'json',
            root:'rows',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer:{
            type:'json'
        },
        appendId: false,
        actionMethods: {
            create : 'POST',
            read   : 'POST',
            update : 'POST',
            destroy: 'POST'
        }
    },
    listeners:{
        // * the same as aftersync
        write:function(store, operation, eOpts){
            var groupGrid = Ext.ComponentQuery.query('groupgrid')[0];
            groupGrid.store.reload();
            console.log('write');
        },
        beforesync:function (operation) {

        }/*,
        update: function(store, record, operation){
            if(operation == 'commit') {
                // обновим записи о потоках в groupgrid
                var groups = record.data.groupId,
                    stream = record.data.stream,
                    type = record.data.typeId,
                    groupGrid = App.app.getController('Main').getGroupgrid();
                //console.log(stream);

                console.log(store);
                console.log(record);


                // перебор массива групп
                if (groups) {
                    for (var i in groups) {
                        // какие записи по группам в groupGrid нужно обновить (поле stream)
                        var mix = groupGrid.store.queryBy(function (record, id) {
                            if (record.get('groupId') == groups[i]
                                && record.get('typeId') == type) {
                                return true;
                            }
                        });
                        console.log(stream);
                        console.log(mix.items[0].data['id']);
                        var id = mix.items[0].data['id'];
                        groupGrid.store.findRecord('id', id).set('stream', stream);
                        groupGrid.store.sort();
                    }

                }
            }
        }*/
    }
});