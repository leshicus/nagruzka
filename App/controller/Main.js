Ext.define('App.controller.Main', {
    extend: 'Ext.app.Controller',
    views: [
        'GroupGrid.Teacher'
        , 'GroupGrid.Room'
        , 'GroupGrid.Week'
        , 'GroupGrid.Grid'
        , 'StreamGrid.Grid'
        , 'AudPanel'
        , 'AudFieldset'
        , 'StudyWorkTabPanel'
        , 'Viewport'
    ],
    models: [
        'ComboModel'
        , 'StreamGridModel'
        , 'GroupGridModel'
        , 'FormGroupGridModel'
        , 'LevelComboModel'
        , 'RoomComboModel'
        , 'TeacherComboModel'
        , 'SubjectComboModel'
    ],
    stores: [
        // 'Period'
        'Division'
        , 'Grade'
        , 'Subject'
        , 'Type'
        , 'Room'
        , 'Build'
        , 'Level'
        , 'Teacher'
        , 'Week'
        , 'HourFact'
        , 'GroupGrid.Grid'
        , 'StreamGrid.Grid'

    ],
    // чтобы можно было обращаться getStreamgrid()
    refs: [
        {
            ref: 'streamgrid',
            selector: 'streamgrid'
        },
        {
            ref: 'groupgrid',
            selector: 'groupgrid'
        },
        {
            ref: 'viewport',
            selector: 'viewport'
        },
        {
            ref: 'groupgridroom',
            selector: 'groupgridroom'
        },
        {
            ref: 'groupgridteacher',
            selector: 'groupgridteacher'
        },
        {
            ref: 'subject',
            selector: 'viewport #subject'
        }
    ],

    onLaunch: function () {
        var me = this;

        me.getViewport().typeStore = this.getTypeStore();
        me.getViewport().roomStore = this.getRoomStore();
        me.getViewport().buildStore = this.getBuildStore();
        me.getViewport().levelStore = this.getLevelStore();
        me.getViewport().teacherStore = this.getTeacherStore();
        me.getViewport().weekStore = this.getWeekStore();
        me.getViewport().subjectStore = this.getSubjectStore();

        // это нужно для того, чтобы при загрузки сторов аудиторий viewport они копировались в сторы viewport.audfieldset
        me.getViewport().subjectStore.on('load', me.onSubjectStoreLoad, me);
        me.getViewport().buildStore.on('load', me.onBuildStoreLoad, me);
        me.getViewport().levelStore.on('load', me.onLevelStoreLoad, me);
        me.getViewport().roomStore.on('load', me.onRoomStoreLoad, me);
        me.getViewport().weekStore.on('load', me.onWeekStoreLoad, me);

        me.getStreamgrid().groupStore.on('load', me.onStreamGridLoad, me);
        // me.getStreamgrid().store.on('beforeload', me.onStreamGridBeforeLoad, me);

        // здесь срабатывают свойства load
        me.getViewport().buildStore.load();
        me.getViewport().levelStore.load();
        me.getViewport().weekStore.load();

        me.getGroupgrid().store.on('load', me.onGroupgridLoad, me);

        //me.getGroupgrid().store.on('update', me.updateGroupGrid, me);
    },
/////////////////////////////////////////////////////////////////
    init: function () {
        console.group('Init Main');

        this.control({
            'viewport #division': {
                select: function (combo, records, eOpts) {
                    var viewport = combo.up('viewport'),
                        comboSubject = viewport.query('#subject')[0],
                        comboDivision = viewport.query('#division')[0],
                        groupGrid = viewport.query('groupgrid')[0],
                        comboPeriod = viewport.query('#period')[0],
                        comboGrade = viewport.query('#grade')[0],
                        roomCombo = this.getController('Main').getGroupgridroom(),
                        teacherCombo = this.getController('Main').getGroupgridteacher();

                    comboSubject.reset();
                    comboPeriod.reset();
                    comboGrade.reset();

                    comboPeriod.store.load({
                        params: {
                            manid: manId,
                            taskid: taskId
                        }
                    });
                    roomCombo.store = this.CopyStore(viewport.roomStore);

                    teacherCombo.store = this.CopyStore(viewport.teacherStore);
                    teacherCombo.store.clearFilter();
                    teacherCombo.store.filter('divId', comboDivision.getValue());

                    //groupGrid.store.removeAll();
                }
            },
            'viewport #period': {
                select: function (combo, records, eOpts) {
                    var viewport = combo.up('viewport'),
                        studyId = records[0].get('id'),
                        comboGrade = viewport.query('#grade')[0],
                        comboDivision = viewport.query('#division')[0],
                        division = comboDivision.getValue(),
                        comboSubject = viewport.query('#subject')[0],
                        gridStream = viewport.query('audpanel #stream-grid')[0],
                        gridGroup = viewport.query('audpanel #group-grid')[0];

                    comboGrade.reset();
                    comboGrade.store.load();

                    comboSubject.reset();

// todo разобраться почему при смене кафедры не показывается список предметов в комбо
                    // тут срабатывает onSubjectStoreLoad
                    viewport.subjectStore.load({
                        params: {
                            studyId: studyId
                        }
                    });

                    gridStream.groupStore.load({
                        params: {
                            studyId: studyId,
                            divId: division
                        }
                    });

                    /*gridStream.store.load({params:{
                     studyId:studyId,
                     divId:division
                     }});*/

                    /*gridStream.teacherStore = this.CopyStore(viewport.teacherStore);
                     gridStream.subjectStore = this.CopyStore(viewport.subjectStore);*/

                    //gridStream.getView().refresh();

                    gridGroup.store.removeAll();
                }
            },
            'viewport #grade': {
                select: function (combo, records, eOpts) {
                    var viewport = combo.up('viewport'),
                        grade = records[0].get('name'),
                        comboSubject = viewport.query('#subject')[0],
                        division = viewport.query('#division')[0].getValue(),
                        groupGrid = viewport.query('groupgrid')[0];

                    comboSubject.reset();
                    comboSubject.store.clearFilter();
                    groupGrid.store.removeAll();

                    // отфильтруем те предметы, которые относятся к данной кафедре и курсу
                    //comboSubject.store = this.CopyStore(viewport.subjectStore);
                    //console.log(comboSubject.store);
                    comboSubject.store.filter(function (rec, id) {
                        if (rec.get('grade') == grade && rec.get('divId') == division)
                            return true;
                    });
                }
            },
            'viewport #subject': {
                select: function (combo, records, eOpts) {
                    var viewport = combo.up('viewport'),
                        gridGroup = viewport.query('#group-grid')[0],
                        comboPeriod = viewport.query('#period')[0],
                        comboGrade = viewport.query('#grade')[0],
                        //comboDivision = viewport.query('#division')[0],
                        comboSubject = viewport.query('#subject')[0],
                        division = viewport.query('#division')[0].getValue();

                    gridGroup.store.load({
                        params: {
                            studyId: comboPeriod.getValue(),
                            grade: comboGrade.getRawValue(),
                            divId: division,
                            subjectId: comboSubject.getValue()
                        }
                    });
                }
            },
            'streamgrid': {
                beforerender: function (me, eOpts) {

                },
                celldblclick: function (row, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console.log('action=create');

                    var data = [],
                        arr = [],
                        streamGrid = Ext.ComponentQuery.query('streamgrid')[0],
                        streamGridSelectedRow = streamGrid.getSelected(),
                        window = Ext.create('App.view.StreamGrid.Edit.Window'),
                        form = Ext.create('App.view.StreamGrid.Edit.Form');


                    // сформируем данные по группам для groupStore формы
                    for (var i in streamGridSelectedRow.data['groupId']) {
                        arr = [streamGridSelectedRow.data['nagId'][i], streamGridSelectedRow.data['groupId'][i]];
                        data.push(arr);
                        //data.push(streamGridSelectedRow.data['groupId'][i].nagId, streamGridSelectedRow.data['groupId'][i].groupId);
                    }

                    form.query('grid')[0].store.loadData(data, false);
                    form.query('grid')[0].store.sort();

                    var buildStore = App.app.getController('Main').getViewport().buildStore,
                        levelStore = App.app.getController('Main').getViewport().levelStore,
                        roomStore = App.app.getController('Main').getViewport().roomStore,
                        grid = form.query('#edit-form-group-grid')[0],
                        type = form.query('#stream-grid-edit-type')[0],
                        subject = form.query('#stream-grid-edit-subject')[0],
                        teacher = form.query('#stream-grid-edit-teacher')[0],
                        build = form.query('#stream-grid-edit-room-build')[0],
                        level = form.query('#stream-grid-edit-room-level')[0],
                        room = form.query('#stream-grid-edit-room')[0],
                        tso = form.query('#stream-grid-edit-room-tso')[0];

                    form.query('audfieldset #stream-grid-edit-room-build')[0].store = this.CopyAutoLoadStore(buildStore);
                    form.query('audfieldset #stream-grid-edit-room-level')[0].store = this.CopyAutoLoadStore(levelStore);
                    form.query('audfieldset #stream-grid-edit-room')[0].store = this.CopyStore(roomStore);

                    // setReadOnly если есть список групп
                    if (grid.store.getCount()) {
                        type.setReadOnly(true);
                        subject.setReadOnly(true);
                        teacher.setReadOnly(true);
                        build.setReadOnly(true);
                        level.setReadOnly(true);
                        room.setReadOnly(true);
                        tso.setReadOnly(true);
                    }
// todo добавление подгруппы в поток убрать, изменение типа не работает
                    // загрузка оставшихся данных в форму
                    form.loadRecord(record);
                    //console.log(form.getForm().getRecord());
                    window.add([form]);
                    window.show();
                    //streamGrid.getView().deselect(streamGridSelectedRow);
                }
            },
            'streamgrid button[action=create]': {
                click: function (button) {
                    console.log('action=create');

                    var window = Ext.create('App.view.StreamGrid.Edit.Window');
                    var form = Ext.create('App.view.StreamGrid.Edit.Form');
                    var buildStore = App.app.getController('Main').getViewport().buildStore,
                        levelStore = App.app.getController('Main').getViewport().levelStore,
                        roomStore = App.app.getController('Main').getViewport().roomStore;

                    form.query('audfieldset #stream-grid-edit-room-build')[0].store = this.CopyAutoLoadStore(buildStore);
                    form.query('audfieldset #stream-grid-edit-room-level')[0].store = this.CopyAutoLoadStore(levelStore);
                    form.query('audfieldset #stream-grid-edit-room')[0].store = this.CopyStore(roomStore);

                    // тип потока может быть лек, лаб или сем. Удаление КР...
                    //form.query('#stream-grid-edit-type')[0].store.removeAt(3,3);

                    window.add([form]);
                    window.show();
                }
            },
            'streamgrid button[action=delete]': {
                click: function (button) {
                    console.log('action=delete');
                    var grid = button.up('grid');
                    grid.DeleteRow();
                }
            },
            'groupgrid button[action=copy]': {
                click: function (button) {
                    console.log('action=create');
                    var grid = button.up('grid');
                    grid.CopyRow();
                }
            },
            'groupgrid button[action=delete]': {
                click: function (button) {
                    console.log('action=delete');
                    var grid = button.up('grid');
                    grid.DeleteRow();
                }
            },
            'groupgrid button[action=refresh]': {
                click: function (button) {
                    console.log('action=refresh');
                    var grid = button.up('grid');
                    grid.store.reload();
                    grid.getView().refresh();
                }
            },
            // свернуть/развернуть список предметов в группе
            'groupgrid button[action=collapse]': {
                click: function (button) {
                    console.log('action=collapse');
                    var grid = button.up('grid'),
                        store = grid.store;

                    // если есть вообще группы
                    if (store.getGroups()[0]) {
                        var firstGroup = store.getGroups()[0].name;

                        if (groupingFeature.isExpanded(firstGroup)) {
                            for (var i = 0; i < store.getGroups().length; i++) {
                                groupingFeature.collapse(store.getGroups()[i].name, true);
                            }
                        } else {
                            for (var i = 0; i < store.getGroups().length; i++) {
                                groupingFeature.expand(store.getGroups()[i].name, true);
                            }
                        }
                    }
                }
            },


            // возможность очистки полей нажатием DELETE
            'groupgridteacher': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            // возможность очистки полей нажатием DELETE
            'groupgridroom': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            // возможность очистки полей нажатием DELETE
            'groupgridweek': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            // возможность очистки полей нажатием DELETE
            'groupgridhourfact': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },
            'groupgrid': {
                // todo при нажатии на поле Аудитория запускается update, даже если ничего не менялось. Только с этим полем проблема.
                cellclick: function (gridview, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    var columnHeader = gridview.ownerCt.columns[cellIndex].text;
                    // Колонка Факт для КР... : формирование нажимаемого стора в зависимости от цифр Факт в других строках того же типа
                    if (columnHeader == 'Факт') {
                        var type = record.get('typeId'),
                            comboHourFact = gridview.ownerCt.query('#hourFact')[0].getEditor();
                        // для ГЭ, КП, КР
                        if (type == '4' || type == '5' || type == '6') {
                            comboHourFact.setReadOnly(false);
                            var tempStoreAll = Ext.create('App.store.HourFact'),
                                dataAll = new Array(),
                                dataFiltered = new Array(),
                                hourAll = record.get('hourAll'),
                                groupName = record.get('groupName');

                            // заполним стор значениями
                            for (var i = 1; i <= hourAll; i++) {
                                dataAll.push(new Array(i, i));
                            }
                            tempStoreAll.loadData(dataAll);
                            // фильтрация часов, кратных 3 или 4
                            tempStoreAll.filter(myFilterFunc);
                            function myFilterFunc(rec, id) {
                                var hourFact = Number(rec.get('name')),
                                    div3 = hourFact % 3,
                                    div4 = hourFact % 4;
                                if (div3 == 0 || div4 == 0) {
                                    // валидация, чтобы сумма фактов часов по данному типу занятий была не больше Всего часов
                                    // возьмем другие записи данного типа для данной группы
                                    var cntMix = gridview.getBubbleTarget().store.queryBy(function (record, id) {
                                        if (record.get('groupName') == groupName && record.get('typeId') == type) {
                                            return true;
                                        }
                                    });
                                    // просуммируем поле Часы-Факт
                                    var sum = 0;
                                    for (var i = 0; i < cntMix.getCount(); i++) {
                                        sum += Number(cntMix.items[i].get('hourFact'));
                                    }
                                    sum += hourFact;
                                    // условие валидности - не больше, чем Всего
                                    return sum <= hourAll;
                                }
                            }

                            comboHourFact.bindStore(tempStoreAll);
                        } else {
                            comboHourFact.setReadOnly(true);
                        }
                    }
                    this.setColumnReadOnlys(cellIndex, record, gridview);
                }
            },
//todo сделать логирование для расписания
            // возможность очистки полей нажатием DELETE
            'viewport audfieldset #stream-grid-edit-room': {
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        field.clearValue();
                    }
                }
            },

            'viewport audfieldset #stream-grid-edit-room-tso': {
                change: function (me, newValue, oldValue, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = me.up('viewport').query('audfieldset #stream-grid-edit-room')[0];
                    if (newValue == '1') {
                        this.filterRooms(roomCombo, 'tso');
                    } else {
                        this.filterRooms(roomCombo, 'tso', 'delete');
                    }

                }
            },

            'viewport audfieldset #stream-grid-edit-room-build': {
                // возможность очистки полей нажатием DELETE
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        // clearValue не работает, т.к. при этом поле subject вообще исчезает из value
                        field.setValue("");

                        // отфильтруем поле Аудитории
                        var roomCombo = field.up('viewport').query('audfieldset #stream-grid-edit-room')[0];
                        this.filterRooms(roomCombo, 'build', 'delete');
                    }
                },
                select: function (combo, records, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = combo.up('viewport').query('audfieldset #stream-grid-edit-room')[0];
                    this.filterRooms(roomCombo, 'build');

                    // отфильтруем поле Этаж
                    var levelCombo = combo.up('viewport').query('audfieldset #stream-grid-edit-room-level')[0];
                    this.filterLevel(levelCombo, records[0].data['id']);
                }
            },

            'viewport audfieldset #stream-grid-edit-room-level': {
                // возможность очистки полей нажатием DELETE
                specialkey: function (field, e) {
                    if (e.getKey() == e.DELETE) {
                        // clearValue не работает, т.к. при этом поле subject вообще исчезает из value
                        field.setValue("");

                        // отфильтруем поле Аудитории
                        var roomCombo = field.up('viewport').query('audfieldset #stream-grid-edit-room')[0];
                        this.filterRooms(roomCombo, 'level', 'delete');
                    }
                },
                select: function (combo, records, eOpts) {
                    // отфильтруем поле Аудитории
                    var roomCombo = combo.up('viewport').query('audfieldset #stream-grid-edit-room')[0];
                    this.filterRooms(roomCombo, 'level');
                }
            }
        });
        console.log('Init Main end');
        console.groupEnd();
    },
/////////////////////////////////////////////////////////////////

    // Функции срабатывающие при загрузке store
    onSubjectStoreLoad: function (store) {
        // скопируем subjectStore и прикрепим его к gridStream
        this.getStreamgrid().subjectStore = this.CopyStore(store);
        this.getStreamgrid().store.sort();

        var comboSubject = this.getViewport().query('#subject')[0];
        comboSubject.store = this.CopyStore(store);
        console.log('onSubjectStoreLoad');
    },
    onBuildStoreLoad: function (store) {
        // скопируем buildStore и прикрепим его к Viewport
        this.getViewport().query('audfieldset #stream-grid-edit-room-build')[0].store = this.CopyAutoLoadStore(store);
        //console.log(store, this.getViewport().query('audfieldset #stream-grid-edit-room-build')[0].store);
    },
    onLevelStoreLoad: function (store) {
        // скопируем levelStore и прикрепим его к Viewport
        this.getViewport().query('audfieldset #stream-grid-edit-room-level')[0].store = this.CopyAutoLoadStore(store);
    },
    onRoomStoreLoad: function (store) {
        // скопируем roomStore и прикрепим его к Viewport
        this.getViewport().query('audfieldset #stream-grid-edit-room')[0].store = this.CopyStore(store);
    },
    onWeekStoreLoad: function (store) {
        // скопируем weekStore и прикрепим его к Viewport
        //console.log(this.getViewport().query('groupgrid #jointBegin'));
        this.getViewport().query('groupgrid #jointBegin')[0].getEditor().store = this.CopyStore(store);
        this.getViewport().query('groupgrid #jointEnd')[0].getEditor().store = this.CopyStore(store);
    },
    // запускается после загрузки streamgrid.groupStore
    onStreamGridLoad: function (store) {
        var viewport = this.getViewport(),
            gridStream = this.getViewport().query('streamgrid')[0],
            comboPeriod = viewport.query('#period')[0],
            studyId = comboPeriod.getValue(),
            comboDivision = viewport.query('#division')[0],
            division = comboDivision.getValue();

        gridStream.store.load({params: {
            studyId: studyId,
            divId: division
        }});
        gridStream.teacherStore = this.CopyStore(viewport.teacherStore);
        gridStream.subjectStore = this.CopyStore(viewport.subjectStore);
    },

    // запускается перед загрузкой streamgrid.store
    onStreamGridBeforeLoad: function (store) {
        var viewport = this.getViewport(),
            gridStream = this.getViewport().query('streamgrid')[0],
            comboPeriod = viewport.query('#period')[0],
            studyId = comboPeriod.getValue(),
            comboDivision = viewport.query('#division')[0],
            division = comboDivision.getValue();
        //console.log(studyId, division);
        /*gridStream.groupStore.load({
         params:{
         studyId:studyId,
         divId:division
         }
         });*/

        /*gridStream.store.load({params:{
         studyId:studyId,
         divId:division
         }});*/

        /*gridStream.teacherStore = this.CopyStore(viewport.teacherStore);
         gridStream.subjectStore = this.CopyStore(viewport.subjectStore);*/
    },

    CopyStore: function (store1) {
        var records = [],
            storeClass = Ext.getClass(store1);

        store1.each(function (r) {
            records.push(r.copy());
        });

        var store2 = Ext.create(storeClass.getName(), {
            model: store1.model.prototype.modelName
        });

        store2.add(records);
        //console.log(store1.model.prototype.modelName, store1, store2);
        return store2;
    },

    CopyAutoLoadStore: function (store1) {
        var records = [],
            storeClass = Ext.getClass(store1);

        store1.each(function (r) {
            records.push(r.copy());
        });

        var store2 = Ext.create(storeClass.getName(), {
            model: store1.model.prototype.modelName
        });

        return store2;
    },

    onGroupgridLoad: function (store) {
        groupingFeature.expandAll();

        var groupgrid = this.getGroupgrid();
        store.each(function (item, index, count) {
            //if(item.data['stream'] != null){
            groupgrid.SubgroupRenumbering(item);
            // }
        });
        //groupingFeature.expandAll();
    },

    // обновление ячеек в GroupGrid, update store
    updateGroupGrid: function (store) {
        //store.sync();
    },

    getTypeStore: function () {
        var store = Ext.create('App.store.Type');
        return store;
    },
    getTeacherStore: function () {
        var store = Ext.create('App.store.Teacher');
        store.load();
        return store;
    },

    getBuildStore: function () {
        var store = Ext.create('App.store.Build');
        return store;
    },

    getLevelStore: function () {
        var store = Ext.create('App.store.Level');
        return store;
    },

    getRoomStore: function () {
        var store = Ext.create('App.store.Room');
        store.load();
        return store;
    },

    getWeekStore: function () {
        var weeks = [],
            arr = [];
        for (var i = 1; i < 19; i++) {
            arr = {'ID': i, 'NAME': i};
            weeks.push(arr);
        }

        var store = Ext.create('App.store.Week', {data: weeks});
        store.load();

        return store;
    },

    getSubjectStore: function () {
        var store = Ext.create('App.store.Subject');
        return store;
    },

    // Фильтрация Этаж
    filterLevel: function (combo, build) {
        combo.store.clearFilter();

        combo.store.filter(function (rec, id) {
            var buildArray = rec.get('build');
            if (buildArray.indexOf(build) !== -1) {
                return true;
            }
        });
    },

    // фильтрация комбо Аудитории в блоке Подбор аудитории
    filterRooms: function (combo, type, action) {
        var roomStore = combo.store,
            viewport = combo.up('viewport'),
            roomCombo = viewport.query('#stream-grid-edit-room')[0],
            buildCombo = viewport.query('#stream-grid-edit-room-build')[0],
            buildId = buildCombo.getValue(),
            levelCombo = viewport.query('#stream-grid-edit-room-level')[0],
            levelId = levelCombo.getValue(),
            tsoCheckbox = viewport.query('#stream-grid-edit-room-tso')[0],
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

    },

    // GroupGrid: установка на некоторые ячейки свойства readOnly
    setColumnReadOnlys: function (cellIndex, record, gridview) {
        var stream = record.get('stream'),
            type = record.get('typeId'),
            comboTeacher = gridview.getBubbleTarget().query('#teacher')[0].getEditor(),
            comboRoom = gridview.getBubbleTarget().query('#room')[0].getEditor(),
            comboJointBegin = gridview.getBubbleTarget().query('#jointBegin')[0].getEditor(),
            comboJointEnd = gridview.getBubbleTarget().query('#jointEnd')[0].getEditor();
        // запреты на редактирование ячеек для занятий, которые в потоке
        if (stream && stream != '0') {
            switch (cellIndex) {
                case 4:
                    // запрет изменения преподавателя если занятие В потоке
                    comboTeacher.setReadOnly(true);
                    break;
                case 5:
                    // запрет изменения аудитории если занятие В потоке
                    comboRoom.setReadOnly(true);
                    break;
                case 8:
                    // запрет изменения C если занятие НЕ в потоке
                    comboJointBegin.setReadOnly(false);
                    break;
                case 9:
                    // запрет изменения По если занятие НЕ в потоке
                    comboJointEnd.setReadOnly(false);
                    break;
                default :
                    break;
            }
        } else {
            switch (cellIndex) {
                case 4:
                    comboTeacher.setReadOnly(false);
                    break;
                case 5:
                    comboRoom.setReadOnly(false);
                    break;
                case 8:
                    comboJointBegin.setReadOnly(true);
                    break;
                case 9:
                    comboJointEnd.setReadOnly(true);
                    break;
                default :
                    break;
            }
        }

        // запреты на редактирование аудиторий для ГЭ, КП, КР
        if (type == '4' || type == '5' || type == '6') {
            comboRoom.setReadOnly(true);
        }
    }

});