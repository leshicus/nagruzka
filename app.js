Ext.onReady(function(){
    Ext.Loader.setConfig({
        enabled:true,
        //disableCaching: false,
        paths:{
            'Ext':'../../../../ext-4.2.1/src',
            'Ext.ux':'../../../../ext-4.2.1/examples/ux'
        }
    });
});


Ext.require([
    'Ext.grid.plugin.DragDrop'
]);

// чтобы нормально значения в комбо отображались
Ext.util.Format.comboRenderer = function (combo) {
    return function (value) {
        var record = combo.findRecord(combo.valueField || combo.displayField, value);
        return record ? record.get(combo.displayField) : combo.valueNotFoundText;
    }
};

Ext.util.Format.gridComboRenderer = function (combo, value, metaData) {
    return function (value, metaData) {
        //console.log(md);
        metaData.style = 'white-space:normal !important;';
        var record = combo.findRecord(combo.valueField || combo.displayField, value);
        return record ? record.get(combo.displayField) : value;
    }
};

function streamGridColumnRenderer(value, metaData, record, rowIndex, colIndex, store, view) {
    var streamGrid = view.ownerCt,
        viewport = streamGrid.up('viewport'),
        columnText = streamGrid.columns[colIndex].text,
        tso = record.data['tso'],
        build = record.data['build'],
        level = record.data['level'];
    switch (columnText) {
        case 'Тип':
            var comboStore = viewport.typeStore;
            break;
        case 'Предмет':
            var comboStore = streamGrid.subjectStore;
            //var comboStore = view.getBubbleTarget().subjectStore;
            break;
        case 'Группа':
            var comboStore = streamGrid.groupStore;
            break;
        case 'Преподаватель':
            var comboStore = streamGrid.teacherStore;
            //var comboStore = view.getBubbleTarget().teacherStore;
            break;
        case 'Аудитория':
            var comboStore = viewport.roomStore;
            break;
        default :
            break;

    }

    metaData.style = 'white-space:normal !important;';
    //metaData.tdAttr = 'data-qtip="' + 'Советик' + '"';

    // проверка на массив (для списочных элементов, multiselect)
    if (value instanceof Array) {
        var str = Array();
        // валидация поля Группы, чтобы было больше 1 группы в потоке
        if (columnText == 'Группа' && value.length < 2) {
            metaData.style += 'background:rgb(243, 169, 202);';
        }

        // перебор элементов массива
        for (var i in value) {
            // найдем в соответствующем хранилище name, соответствующую данному id
            var rec = comboStore.findRecord('id', value[i]);
            if(rec){
                var name = rec.data['name'];
            }
            str.push(name);
        }

        // массив явно преобразовываем в строку через пробел
        return str.join(", \n");
    } else {  // обычная переменная
        // случай с аудиториями- нужно добавить tso, build, level
        if(columnText == 'Аудитория'){
            if(record.data['roomId'] == ""
                || record.data['roomId'][0] == ""
                || !record.data['roomId']){ // отображаем ТСО и прочее только если не указана аудитория явно
                str = [];
                if(tso || build || level){
                    if(tso){
                        str.push("ТСО");
                    }
                    if(build){
                        str.push("К-" + build);
                    }
                    if(level){
                        str.push("Э-" + level);
                    }
                }
                return str.join(", \n");
            }
        }else{
            if (comboStore.findRecord('id', value)) {
                var rec = comboStore.findRecord('id', value),
                    name = rec.data['name'];
                return name;
            }
        }

    }
}

// ренд для групп в editForm
function editFormGroupGridColumnRenderer(value, metaData, record, rowIndex, colIndex, store, view) {
    switch (colIndex) {
        case 0:
            var streamGrid = Ext.ComponentQuery.query('streamgrid')[0],
                groupStore = streamGrid.groupStore;
            break;
        default :
            break;
    }

    if (groupStore.findRecord('id', value)) {
        var rec = groupStore.findRecord('id', value);
        return rec.data['name'];
    }
}

function groupGridColumnRenderer(value, metaData, record, rowIndex, colIndex, store, view) {
    var groupGrid = view.ownerCt,
        viewport = groupGrid.up('viewport'),
        division = viewport.query('#division')[0].getValue(),
        columnText = groupGrid.columns[colIndex].text;

    switch (columnText) {
        // Тип
        case 'Тип':
            var comboStore = viewport.typeStore;
            break;
        // Часы-Факт
        /*case 2:
            var comboStore = groupGrid.query('#hourFact')[0].getEditor().store;
            break;*/
        // Преподаватель
        case 'Преподаватель':
            var comboStore = viewport.teacherStore;
            //comboStore.filter('divId', division);
            break;
        // Аудитория
        case 'Аудитория':
            var comboStore = viewport.roomStore;
            break;
        default :
            break;
    }

    metaData.style = 'white-space:normal !important;';
    //metaData.tdAttr = 'data-qtip="' + 'Советик' + '"';

    if (value instanceof Array) {
        var str = Array();
        // перебор элементов массива
        for (var i in value) {
            if (comboStore.findRecord('id', value[i])) {
                var rec = comboStore.findRecord('id', value[i]);
                str.push(rec.data['name']);
            }
        }
        return str.join(", \n");
    } else {  // обычная переменная
        if (comboStore.findRecord('id', value)) {
            var rec = comboStore.findRecord('id', value),
                str = rec.data['name'];
            return str;
        }
    }
}

function formatDate(value) {
    return value ? Ext.Date.dateFormat(value, 'd.m.Y') : '';
}

// группировать поля в гриде по полю name
var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
    groupHeaderTpl:'{name}',
    hideGroupedHeader:true,
    //startCollapsed:false,
    id:'nameGrouping'
});

// плагин, чтобы можно было ячейки в гриде редактировать
var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit:1
});

// красная звездочка справа от обязательных полей
var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

// * заплатка: ошибка при группировке
Ext.define('App.overrides.view.Table', {
    override: 'Ext.view.Table',

    getRecord: function (node) {
        node = this.getNode(node);
        if (node) {
            return this.dataSource.data.get(node.getAttribute('data-recordId'));
        }
    },

    indexInStore: function (node) {
        node = this.getNode(node, true);
        if (!node && node !== 0) {
            return -1;
        }
        return this.dataSource.indexOf(this.getRecord(node));
    }
});



Ext.application({
    name:'App',
    appFolder:'App',
    autoCreateViewport:true,
    launch:function () {
        App.app = this;
        Ext.QuickTips.init();
        //Ext.util.CSS.swapStyleSheet("theme","../../../../ext-4.1.1/resources/css/ext-all-gray-debug.css");
        console.log('launch App');
    },
    controllers:[
        'StreamGridEditWindow',
        'Main'

    ]
});
