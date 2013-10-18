Ext.define('App.controller.StreamGridEditWindow', {
    extend:'Ext.app.Controller',
    views:[
        'StreamGrid.Edit.Form'
       // , 'StreamGrid.Edit.Window'
    ],
    models:[
        'ComboModel'

    ],
    stores:[
        // 'StreamGrid.Edit.GridGroup'
    ],
    refs:[
        {
            ref:'form',
            selector:'streamgrideditform'
        },
        {
            ref:'editFormGrid',
            selector:'streamgrideditform grid'
        },
        {
            ref:'roomcombo',
            selector:'streamgrideditform#stream-grid-edit-room'
        }
    ],
    init:function () {
        console.log('Init StreamGridEditWindow');
        /*var a = 1, b = "1";
         console.assert(a === b, 'a != b');*/

        this.control({
            'streamgrideditform button[action=save]':{
                click:function (button) {
                    console.log('save button');

                    var form = button.up('form'),
                        win = form.up('window');
                    if (form.getForm().isValid() ) {
                        console.log('форма в порядке');
                        var values = form.getValues(),
                            record = form.getForm().getRecord(),
                            streamGrid = this.application.getController('Main').getStreamgrid(),
                            groupGrid = this.application.getController('Main').getGroupgrid();
                        // * формируем массив групп из gridForm
                        // * это нужно, чтобы учесть, если какие-то группы были удалены из списка
                        var formGroupStore = this.getForm().query('grid')[0].store,
                            formGroup = formGroupStore.data.items,
                        // * отдельно формируем массивы для groupId & nagId
                            formGroupIdArr = [],
                            formNagIdArr = [];
// TODO formGroup = formGroupStore.data.items, поменять на getRange()
                        if (record) {  // обновление, возможно только если есть группы
                            console.log('изменили поток');
                            // * отдельно возьмем стор грида, т.к. form.getValues его не берет
                            // * формируем массив групп из стора формы
                            for (var i in formGroup) {
                                formGroupIdArr.push(formGroup[i].data.groupid);
                                formNagIdArr.push(formGroup[i].data.nagid);
                            }
                            // * значения из формы присваиваем гриду потоков
                            values['groupid'] = formGroupIdArr;
                            values['nagid'] = formNagIdArr;

                            // * массив nagId удаленных  групп
                            var compareArrays = streamGrid.compareArrays(record.data['nagid'], formNagIdArr);
                            // * если снимают чекер ТСО, то он пропадает вообще из values, поэтому если tso не найдено, значит оно не отмечено
                            if (!values['tso']) {
                                values['tso'] = "";
                            }

                            // * если явно указана аудитория, то признаки ТСО, корпус и этаж не сохраняем
                            if (values['roomid'][0] != "" && values['roomid'] != "") {
                                values['tso'] = "";
                                values['build'] = "";
                                values['level'] = "";
                            }

                            if (compareArrays.length) {
                                values['deleted_nagid'] = compareArrays;
                                // todo тут проблемы с обновлением грида- оно иногда проходит раньше, чем запрос к базе
                               // groupGrid.store.reload();
                            }
                            record.set(values);
                        } else if (!record) {  // * добавление
                            console.log('добавим новый поток');
                            // получаю следующий номер потока
                            Ext.Ajax.request({
                                url:'php/getStreamNextval.php',
                                success:function (response, options) {
                                    var obj = Ext.decode(response.responseText),
                                        stream = obj.stream;
                                    //var stream = batch.operations[0].request.scope.reader.jsonData["stream"];
                                    values['groupid'] = [];
                                    values['raspredid'] = [];
                                    values['nagid'] = [];
                                    values['stream'] = stream;
                                    // * создаю модель со значениями из формы и вставляю их в стор
                                    var rec = Ext.create('App.model.StreamGridModel', values);
                                    //Ext.data.Model.id(rec);
                                    streamGrid.store.insert(0, rec);
                                }
                            });
                        } else {
                            console.log('что-то с record');
                        }
                        win.close();
                    } else {
                        alert('Форма заполнена не корректно');
                    }
                }
            },

            // нажатие кнопки с красным "кирпичем"- удалить- в гриде групп
            'streamgrideditform grid actioncolumn':{
                click:function (grid, view, recordIndex, cellIndex, item, e) {
                    console.log('delete group from editFormGrid');
                    var //store = this.getEditFormGrid().store,
                        type = grid.up('form').down('#stream-grid-edit-type'),
                        subject = grid.up('form').down('#stream-grid-edit-subject'),
                        teacher = grid.up('form').down('#stream-grid-edit-teacher'),
                        build = grid.up('form').down('#stream-grid-edit-room-build'),
                        level = grid.up('form').down('#stream-grid-edit-room-level'),
                        room = grid.up('form').down('#stream-grid-edit-room'),
                        tso = grid.up('form').down('#stream-grid-edit-room-tso');

                    store = this.getEditFormGrid().store;
                    store.removeAt(recordIndex);


                    // сделаем поле Тип редактируемым
                    if (store.getCount() == 0) {
                        type.setReadOnly(false);
                        subject.setReadOnly(false);
                        teacher.setReadOnly(false);
                        build.setReadOnly(false);
                        level.setReadOnly(false);
                        room.setReadOnly(false);
                        tso.setReadOnly(false);
                    }
                    //store.sync();
                }
            },

            'streamgrideditform button[action=cancel]':{
                click:function (button) {
                    console.log('cancel button');
                    button.up('form').getForm().reset();
                    button.up('window').close();
                }
            },

            // обработка св-ва drop
            'streamgrid dataview':{
                // чтобы не добавлялась запись в грид при драгндропе:
                // сохраняем перемещаемую запись в переменную droppedRecords, очищаем список перемещаемых записей
                beforedrop:function (node, data, overModel, dropPos, opts) {
                    console.log('beforedrop');
                   // console.log(data.records);
                    // todo тут хрень какая-то: data.records показывает старое значение.
                    this.droppedRecords = data.records;
                    data.records = [];
                },
                drop:function (node, data, dropRec, dropPosition) {
                    var groupGrid = this.application.getController('Main').getGroupgrid(),
                        streamGrid = this.application.getController('Main').getStreamgrid(),
                        streamStore = streamGrid.store;
                    // логика добавления группы в поток
                    groupGrid.dropSuitableType(this.droppedRecords[0], dropRec);
                }
            },

            // возможность очистки полей нажатием DELETE
            'streamgrideditform #stream-grid-edit-type':{
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                },
                // убрать КП... из списка
                expand:function (field, eOpts) {
                    var picker = field.getPicker();
                    field.store.filterBy(function (rec, id) {
                        return id < 4;
                    });
                }
                /*,
                 collapse:function (me, eOpts) {
                 me.store.clearFilter();
                 }*/
            },
            // возможность очистки полей нажатием DELETE
            'streamgrideditform #stream-grid-edit-subject':{
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        // clearValue не работает, т.к. при этом поле subject вообще исчезает из value
                        field.setValue("");
                    }
                }
            },
            // возможность очистки полей нажатием DELETE
            'streamgrideditform #stream-grid-edit-teacher':{
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            // возможность очистки полей нажатием DELETE
            'streamgrideditform #stream-grid-edit-room':{
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            'streamgrideditform #stream-grid-edit-room-tso':{
                change:function (me, newValue, oldValue, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = me.up('form').query('audfieldset #stream-grid-edit-room')[0];
                    if (newValue == '1') {
                        this.filterRooms(roomCombo, 'tso');
                    } else {
                        this.filterRooms(roomCombo, 'tso', 'delete');
                    }
                }
            },
            'streamgrideditform #stream-grid-edit-room-build':{
                // возможность очистки полей нажатием DELETE
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        // clearValue не работает, т.к. при этом поле subject вообще исчезает из value
                        field.setValue("");

                        // отфильтруем поле Аудитории
                        var roomCombo = field.up('form').query('audfieldset #stream-grid-edit-room')[0];
                        this.filterRooms(roomCombo, 'build', 'delete');
                    }
                },
                select:function (combo, records, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = combo.up('form').query('audfieldset #stream-grid-edit-room')[0];
                    //console.log(roomCombo);
                    this.filterRooms(roomCombo, 'build');

                    // отфильтруем поле Этаж
                    var levelCombo = combo.up('form').query('audfieldset #stream-grid-edit-room-level')[0];
                    this.filterLevel(levelCombo, records[0].data['id']);
                }
            },
            'streamgrideditform #stream-grid-edit-room-level':{
                // возможность очистки полей нажатием DELETE
                specialkey:function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        // clearValue не работает, т.к. при этом поле subject вообще исчезает из value
                        field.setValue("");

                        // отфильтруем поле Аудитории
                        var roomCombo = field.up('form').query('audfieldset #stream-grid-edit-room')[0];
                        this.filterRooms(roomCombo, 'level', 'delete');
                    }
                },
                select:function (combo, records, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = combo.up('form').query('audfieldset #stream-grid-edit-room')[0];
                    this.filterRooms(roomCombo, 'level');
                }
            }
        });
        console.log('Init StreamGridEditWindow end');
    },

    // Фильтрация Этаж
    filterLevel:function (combo, build) {
        combo.store.clearFilter();

        combo.store.filter(function (rec, id) {
            var buildArray = rec.get('build');
            if (buildArray.indexOf(build) !== -1) {
                return true;
            }
        });
    },

    // фильтрация комбо Аудитории
    filterRooms:function (combo, type, action) {
        var roomStore = combo.store,
            form = combo.up('form'),
            roomCombo = form.query('#stream-grid-edit-room')[0],
            buildCombo = form.query('#stream-grid-edit-room-build')[0],
            buildId = buildCombo.getValue(),
            levelCombo = form.query('#stream-grid-edit-room-level')[0],
            levelId = levelCombo.getValue(),
            tsoCheckbox = form.query('#stream-grid-edit-room-tso')[0],
            tsoCheckboxValue = tsoCheckbox.getValue();

        roomCombo.clearValue();

        switch (action) {
            case 'delete':
                switch (type) {
                    case 'build':
                        roomStore.filter(function (rec, id) {
                            var tso = rec.get('tso');
                            if (tso == tsoCheckboxValue
                                || !tsoCheckboxValue) {
                                return true;
                            }
                        });
                        break;
                    case 'level':
                        roomStore.filter(function (rec, id) {
                            var build = rec.get('build'),
                                tso = rec.get('tso');
                            if ((build == buildId || !buildId)
                                && (tso == tsoCheckboxValue || !tsoCheckboxValue)) {
                                return true;
                            }
                        });
                        break;
                    case 'tso':
                        roomStore.filter(function (rec, id) {
                            var build = rec.get('build'),
                                level = rec.get('level');
                            if ((level == levelId || !levelId)
                                && (build == buildId || !buildId)) {
                                return true;
                            }
                        });
                        break;
                    default:
                        roomStore.filter(function (rec, id) {
                            return true;
                        });
                        break;
                }
                break;
            default:
                switch (type) {
                    case 'build':
                        roomStore.filter(function (rec, id) {
                            var level = rec.get('level'),
                                build = rec.get('build'),
                                tso = rec.get('tso');
                            if ((level == levelId || !levelId)
                                && build == buildId
                                && (tso == tsoCheckboxValue || !tsoCheckboxValue)) {
                                return true;
                            }
                        });
                        break;
                    case 'level':
                        roomStore.filter(function (rec, id) {
                            var level = rec.get('level'),
                                build = rec.get('build'),
                                tso = rec.get('tso');
                            if (level == levelId
                                && build == buildId
                                && (tso == tsoCheckboxValue || !tsoCheckboxValue)) {
                                return true;
                            }
                        });
                        break;
                    case 'tso':
                        roomStore.filter(function (rec, id) {
                            var level = rec.get('level'),
                                build = rec.get('build'),
                                tso = rec.get('tso');
                            if ((level == levelId || !levelId)
                                && (build == buildId || !buildId)
                                && tso == tsoCheckboxValue) {
                                return true;
                            }
                        });
                        break;
                    default:
                        roomStore.filter(function (rec, id) {
                            return true;
                        });
                        break;
                }
                break;
        }

    }/*,

     CopyStore:function (store1) {
     var records = [],
     storeClass = Ext.getClass(store1);

     store1.each(function (r) {
     records.push(r.copy());
     });

     var store2 = Ext.create(storeClass.getName(),{
     model:store1.model.prototype.modelName
     });

     store2.add(records);
     console.log(store1.model.prototype.modelName, store2);
     return store2;
     }*/


});