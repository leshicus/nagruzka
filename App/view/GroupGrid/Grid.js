Ext.define('App.view.GroupGrid.Grid', {
    extend:'Ext.grid.Panel',
    alias:'widget.groupgrid',
    itemId:'group-grid',
    frame:true,
    //forceFit:true,
    flex:1,
    title:'Группы',
    margin: '5 10 5 5',
    features:[groupingFeature],
    plugins:[
        cellEditing
    ],
    viewConfig:{
        plugins:{
            ptype:'gridviewdragdrop',
            dragText:'Переместите группу в нужный поток',
            ddGroup:'GridExample',
            enableDrop:false
        },
        copy:true
    },
    columnLines:true,
    initComponent:function () {
        console.log('Init GroupGrid');

        // загружаем сторы
        this.store = Ext.create('App.store.GroupGrid.Grid');
        // создаем комбо c уже загруженными сторами
        var teacher = Ext.create('App.view.GroupGrid.Teacher'),
            jointBegin = Ext.create('App.view.GroupGrid.Week'),
            jointEnd = Ext.create('App.view.GroupGrid.Week'),
            room = Ext.create('App.view.GroupGrid.Room'),
            hourFact = Ext.create('App.view.GroupGrid.HourFact');

/*        teacher.store.filterBy(function (rec, id) {
            return rec.get('divid') == divid;
        });*/

        this.tbar = [
            {
                text:'Дублировать',
                action:'copy',
                iconCls:'icon_copy'
            },
            '-',
            {
                text:'Удалить',
                action:'delete',
                iconCls:'icon_delete'
            },
            '->',
            {
                text:'Свернуть/развернуть',
                action:'collapse',
                iconCls:'icon_pm'
            },
            '-',
            {
                text:'Обновить',
                action:'refresh',
                iconCls:'icon_refresh'
            }
        ];
        this.columns = [
            {
                text:'Тип',
                dataIndex:'typeid',
                width:50,
                sortable:false,
                menuDisabled:true,
                renderer:groupGridColumnRenderer
            },
            {
                text:'Часы',
                menuDisabled:true,
                columns:[
                    {
                        text:'Всего',
                        dataIndex:'hourall',
                        width:50,
                        menuDisabled:true
                    },
                    {
                        text:'Факт',
                        dataIndex:'hourfact',
                        itemId:'hourFact',
                        width:45,
                        menuDisabled:true,
                        editor:hourFact
                        //renderer:groupGridColumnRenderer
                    }
                ]
            },
            {
                text:'Подгр',
                dataIndex:'subgroup',
                width:50,
                menuDisabled:true
            },
            {
                text:'Преподаватель',
                dataIndex:'teacherid',
                itemId:'teacher',
                flex:1,
                editor:teacher,
                menuDisabled:true,
                renderer:Ext.util.Format.comboRenderer(teacher)
            },
            {
                text:'Аудитория',
                dataIndex:'roomid',
                itemId:'room',
                width:80,
                editor:room,
                menuDisabled:true,
                renderer:groupGridColumnRenderer
            },
            {
                text:'Поток',
                dataIndex:'stream',
                width:70,
                menuDisabled:true,
                align:'center'
            },
            {
                text:'Совместно (недели)',
                columns:[
                    {
                        text:'Кафедра',
                        width:100,
                        sortable:true,
                        dataIndex:'jointdivision'
                    },
                    {
                        text:'С',
                        width:40,
                        sortable:true,
                        itemId:'jointBegin',
                        dataIndex:'jointbegin',
                        menuDisabled:true,
                        editor:jointBegin
                    },
                    {
                        text:'По',
                        width:40,
                        sortable:true,
                        itemId:'jointEnd',
                        dataIndex:'jointend',
                        menuDisabled:true,
                        editor:jointEnd
                    }
                ]
            }
        ];

        this.callParent(arguments);
        console.log('Init GroupGrid end');
    },

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
        var selection = this.getSelected();

        // нельзя давать удалять запись, если она единственная такого типа
        var groupName = selection.data['groupname'],
            type = selection.data['typeid'],
            stream = selection.data['stream'];

        var cntMix = this.store.queryBy(function (record, id) {
            if (record.get('groupname') == groupName && record.get('typeid') == type) {
                return true;
            }
        });
        if (cntMix.getCount() == 1) {
            Ext.example.msg('Не удалено', 'Нельзя удалить последнюю запись данного типа');
        } else {
            // * нельзя удалять запись, которая в потоке
            if(!stream){
                Ext.Msg.confirm('Удаление занятия', 'Удалить занятие?', function (button) {
                    if (button == 'yes') {
                        this.store.remove(selection);
                        //this.store.sync();
                        // перенумерация подгрупп
                        this.SubgroupRenumbering(selection);
                        this.store.reload();
                        // todo проверить, если удалять у нескольких групп, то какие-то записи не удаляет из базы, что-то с синхр

                    }
                }, this);
            }else{
                Ext.example.msg('Не удалено', 'Нельзя удалить запись, которая в потоке');
            }

        }
    },

    // Дублирование отмеченной строки в гриде
    CopyRow:function (button) {
        var selectedRow = this.getSelected(),
            idx = this.store.indexOf(selectedRow),
            groupgrid = Ext.ComponentQuery.query('groupgrid')[0];  // индекс копируемой строки
        if (selectedRow) {
            // дублировать можно только занятия не в потоке и не лекции
            if (selectedRow.data['stream'] == "" && selectedRow.data['typeid'] != '1') {
                /* // пример как можно взять возвращаемое значение из php
                this.store.sync({
                    success:function (batch) {
                        new_id = batch.operations[0].request.scope.reader.jsonData["message"];
                    }
                });*/
                Ext.Ajax.request({
                    url:'php/getLessonNextval.php?typeid=' + selectedRow.get('typeid'),
                    success:function (response, options) {
                        var obj = Ext.decode(response.responseText),
                            id = obj.id,
                            newRecord = selectedRow.copy();

                        newRecord.set('hourfact', 0);
                        newRecord.setId(id);
                        // генерация уникального id для скопированного record
                        Ext.data.Model.id(newRecord);
                        // добавление новой записи в store
                        groupgrid.store.insert(idx + 1, newRecord);
                        //groupgrid.store.sync();
                        groupgrid.SubgroupRenumbering(selectedRow);
                    }
                });
            } else {
                Ext.example.msg('Не добавлено', 'Занятие в потоке или лекция');
            }
        }
    },

    // перенумерация подгрупп
    SubgroupRenumbering:function (record) {
        var group = record.data['groupid'],
            type = record.data['typeid'],
            stream = record.data['stream'],
            j = 0;

        // * Только для лекций, лаб и семинаров.
        // * И не для потоков, т.к. там 2 строки имеют смысл не подгрупп,
        // * а то, что несколько преподавателей ведут поток.
        if (type <= 3 && stream == "") {
            var cntMix = this.store.queryBy(function (record, id) {
                if (record.get('groupid') == group && record.get('typeid') == type) {
                    j++;
                    record.data['subgroup'] = j;
                    return true;
                }
            });
            // если одна запись, то признак подгруппы убрать
            if (cntMix.getCount() == 1) {
                var id = cntMix.items[0].get('id');
                this.store.findRecord('id', id).data['subgroup'] = null;
            }
            this.store.sort();
        }
    },

    // событие drop. После проверки на наличие подходящего типа занятия
    dropSuitableType:function (recs, dropRec) {
        var stream = dropRec.get('stream'),
            streamGrid = Ext.ComponentQuery.query('streamgrid')[0],
            streamStore = streamGrid.store,
            streamType = dropRec.get('typeid'),
            groupType = recs.get('typeid'),
            rec = streamStore.findRecord('stream', stream),
            groupSource = recs.get('groupid'),
            groupGrid = Ext.ComponentQuery.query('groupgrid')[0],
            groupSourceId = recs.get('id'),
            groupStore = groupGrid.store,
            groups = rec.data['groupid'];

        // проверим, что занятие не разделено на подгруппы
        if (recs.get('subgroup')) {
            Ext.example.msg('Не добавлено', 'Занятие разделено на подгруппы');
        } else {
            // проверим, что занятие уже не находится в потоке
            if (recs.get('stream')) {
                Ext.example.msg('Не добавлено', 'Занятие уже в потоке: ' + recs.get('stream'));
            } else {
                // проверим, может тут есть уже такая группа
                for (var i in groups) {
                    if (groups[i] == groupSource) {// такая группа уже есть
                        var groupExists = true;
                    }
                }
                // все в порядке, такой группы в потоке пока нет
                if (!groupExists) {
                    /*проверим, а занятие того ли типа добавляется в поток:
                     1.)если тип добавляемого занятия не совпадает с типом занятия
                     в потоке, нужно спросить подтверждение
                     2.) если в группе есть подходящее по типу занятие, то нужно об этом сообщить*/
                    if (streamType != groupType) { // разные типы занятий
                        var cnt = this.getCountSuitableType(groupSource, streamType, groupSourceId, groupStore);
                        //console.log(cnt);
                        if (cnt > 0) {
                            Ext.example.msg('Не добавлено', 'В группе есть занятие подходящего типа. Выберите его');
                        } else {
                            // подходящего по типу занятия не нашли. Нужно менять тип занятия
                            Ext.Msg.confirm('Изменение типа', 'Тип занятия потока отличается от типа занятия группы.<br>Поменять тип занятия группы?', function (button) {
                                if (button == 'yes') {
                                    this.store.findRecord('id', groupSourceId).set('typeid', streamType);
                                    this.insertRowToStreamGrid(recs, dropRec, groupStore, streamStore);
                                }
                            }, this);
                        }
                    } else { // одинаковый тип занятий, просто добавляем группы
                        this.insertRowToStreamGrid(recs, dropRec, groupStore, streamStore);
                    }
                    this.getView().refresh();
                } else { // такая группа уже есть в потоке. Сообщаем.
                    Ext.example.msg('Не добавлено', 'Занятие уже есть в этом потоке');
                }
            }
        }
    },
    // вставлялка группы в поток drop'ом
    insertRowToStreamGrid:function (recs, dropRec, groupStore, streamStore) {
        var stream = dropRec.get('stream'),
            streamGrid = Ext.ComponentQuery.query('streamgrid')[0],
            groupId = recs.get('groupid'),
            nagId = recs.get('nagid'),
            subjectId = dropRec.get('subjectid'),
            teacherId = dropRec.get('teacherid'),
            roomId = dropRec.get('roomid'),
            typeId = dropRec.get('typeid'),
            build = dropRec.get('build'),
            level = dropRec.get('level'),
            tso = dropRec.get('tso'),
            raspredId = recs.get('id'),
            groupGrid = Ext.ComponentQuery.query('groupgrid')[0];

        var groupTarget = streamStore.findRecord('stream', stream).get('groupid');
        //console.log(groupTarget, groupId, stream, streamStore, nagId);
        // проверим, в обновляемом потоке 1 группа или массив (groupTarget- массив или нет)
        streamStore.findRecord('stream', stream).data['groupid'].push(groupId);
        streamStore.findRecord('stream', stream).data['nagid'].push(nagId);

        // * добавление в базу новой группы
        // * при этом создаются записи в NAGRUZKA и NAGRUZKA_RASPRED
        Ext.Ajax.request({
            url:'php/StreamGrid/syncGrid.php' + '?act=addGroup'
                                              + '&' + tablesPhpStream
                                              + '&groupid=' + groupId
                                              + '&nagid=' + nagId
                                              + '&stream=' + stream
                                              + '&subjectid=' + subjectId
                                              + '&teacherid=' + teacherId
                                              + '&roomid=' + roomId
                                              + '&typeid=' + typeId
                                              + '&build=' + build
                                              + '&level=' + level
                                              + '&tso=' + tso
                                              + '&raspredid=' + raspredId,
            success:function (response, options) {
                var obj = Ext.decode(response.responseText),
                    nagId = obj.nagid,
                    groupId = obj.groupid;

                // * обновим stream в строке-исходнике в groupGrid
                // * просто показать, что запись теперь в потоке
                var idSource = recs.data['id'],
                    sourceRec = groupGrid.store.findRecord('id', idSource);
                sourceRec.data['stream'] = stream;
                sourceRec.data['teacherid'] = dropRec.get('teacherid');
                sourceRec.data['roomid'] = dropRec.get('roomid');
                dropRec.phantom = false;
                groupGrid.store.reload();
            }
        });
        streamStore.sort();

    },

    // поищем в исходной группе, может там есть подходящее по типу занятие
    // возвращаем количество подходящих записей (0 или 1)
    getCountSuitableType:function (groupSource, streamType, groupSourceId, groupStore) {
        var mix = groupStore.queryBy(function (record, id) {
            if (record.get('groupid') == groupSource
                && record.get('typeid') == streamType
                && record.get('id') != groupSourceId) {
                return true;
            }
        });
        return mix.getCount();
    },

    // событие drop. Удаление автоматически добавляемой ячейки
    dropDeleteAutoRow:function (dropPosition, dropRec, streamStore) {
        switch (dropPosition) {
            case 'before':
                if (dropRec.index) {
                    var targetIndex = dropRec.index;
                } else {
                    var targetIndex = 0;
                }
                streamStore.removeAt(targetIndex);
                break;
            case 'after':
                var targetIndex = dropRec.index + 1;
                streamStore.removeAt(targetIndex);
                break;
            default :
                break;
        }
    }
});