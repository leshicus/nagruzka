<?
require_once("./../../include.php");

$studyId = $_REQUEST['studyId'];
$divId = $_REQUEST['divId'];
$data = json_decode(file_get_contents('php://input'), true);
$success = true; // результат выполнения блока

// актуальные таблицы
$nagruzka = $_REQUEST['nagruzka'];
$nagruzka_lec = $_REQUEST['nagruzka_lec'];
$nagruzka_lab = $_REQUEST['nagruzka_labs'];
$nagruzka_sem = $_REQUEST['nagruzka_sem'];
$nagruzka_rep = $_REQUEST['nagruzka_rep'];


switch ($_REQUEST['act']) {
    case 'read':
        $query = "
                select max(t.potok_lek) as STREAM,
                       (case when (max(t.potok_lek )> 0 and max(t.potok_lek) is not null)  then '1' end) as TYPEID,
                       (
                           select
                                  to_char(wm_concat(distinct n.groid))
                           from   $nagruzka n
                           where n.potok_lek = t.potok_lek
                       ) as GROUPID,
                       (
                           select
                                  to_char(wm_concat(distinct n.nagid))
                           from   $nagruzka n
                           where n.potok_lek = t.potok_lek
                       ) as NAGID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.id, '')))
                           from   nagruzka_raspred l
                           where l.stream = t.potok_lek
                           and   l.nagtypeid = 1
                           group by l.stream
                       ) as RASPREDID,  -- id NAGRUZKA_RASPRED
                       max(t.potok_couid) as SUBJECTID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.audids, '')))
                           from   $nagruzka_lec l
                           where l.stream        = t.potok_lek
                           and   l.nagtypeid = 1
                       ) as ROOMID,
                       (
                           select
                                  --to_char(wm_concat(distinct '\"teacherId\"=>' || nvl(l.prepid_lec, '0')))
                                  to_char(wm_concat(distinct nvl(l.prepid, '')))
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lek
                           and   l.nagtypeid = 1
                           group by l.stream
                       ) as TEACHERID,
                       (
                           select
                                  max(l.tso)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lek
                           and   l.nagtypeid = 1
                       ) as TSO,
                       (
                           select
                                  max(l.build)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lek
                           and   l.nagtypeid = 1
                       ) as BUILD,
                       (
                           select
                                  max(l.lvl)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lek
                           and   l.nagtypeid = 1
                       ) as LVL
                from $nagruzka t,
                     groups    gr
                where t.studyid = '$studyId'
                and   t.divid   = '$divId'
                and   gr.groid  = t.groid
                and   gr.quaid <> 3
                and   t.potok_lek <> 0
                and (case when t.lec > 0 then '1' end) is not null
                group by t.potok_lek

                union

                select max(t.potok_lab) as STREAM,
                       (case when (max(t.potok_lab )> 0 and max(t.potok_lab) is not null)  then '2' end) as TYPEID,
                       (
                           select
                                  to_char(wm_concat(distinct n.groid))
                           from   $nagruzka n
                           where n.potok_lab = t.potok_lab
                       ) as GROUPID,
                       (
                           select
                                  to_char(wm_concat(distinct n.nagid))
                           from   $nagruzka n
                           where n.potok_lab = t.potok_lab
                       ) as NAGID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.id, '')))
                           from   nagruzka_raspred l
                           where l.stream = t.potok_lab
                           and   l.nagtypeid = 2
                           group by l.stream
                       ) as RASPREDID,  -- id NAGRUZKA_RASPRED
                       max(t.potok_couid) as SUBJECTID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.audids, '')))
                           from   $nagruzka_lec l
                           where l.stream        = t.potok_lab
                           and   l.nagtypeid = 2
                       ) as ROOMID,
                       (
                           select
                                  --to_char(wm_concat(distinct '\"teacherId\"=>' || nvl(l.prepid_lec, '0')))
                                  to_char(wm_concat(distinct nvl(l.prepid, '')))
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lab
                           and   l.nagtypeid = 2
                           group by l.stream
                       ) as TEACHERID,
                       (
                           select
                                  max(l.tso)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lab
                           and   l.nagtypeid = 2
                       ) as TSO,
                       (
                           select
                                  max(l.build)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lab
                           and   l.nagtypeid = 2
                       ) as BUILD,
                       (
                           select
                                  max(l.lvl)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_lab
                           and   l.nagtypeid = 2
                       ) as LVL
                from $nagruzka t,
                     groups    gr
                where t.studyid = '$studyId'
                and   t.divid   = '$divId'
                and   gr.groid  = t.groid
                and   gr.quaid <> 3
                and   t.potok_lab <> 0
                and (case when t.lab > 0 then '2' end) is not null
                group by t.potok_lab

                union

                select max(t.potok_sem) as STREAM,
                       (case when (max(t.potok_sem )> 0 and max(t.potok_sem) is not null)  then '3' end) as TYPEID,
                       (
                           select
                                  to_char(wm_concat(distinct n.groid))
                           from   $nagruzka n
                           where n.potok_sem = t.potok_sem
                       ) as GROUPID,
                       (
                           select
                                  to_char(wm_concat(distinct n.nagid))
                           from   $nagruzka n
                           where n.potok_sem = t.potok_sem
                       ) as NAGID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.id, '')))
                           from   nagruzka_raspred l
                           where l.stream = t.potok_sem
                           and   l.nagtypeid = 3
                           group by l.stream
                       ) as RASPREDID,  -- id NAGRUZKA_RASPRED
                       max(t.potok_couid) as SUBJECTID,
                       (
                           select
                                  to_char(wm_concat(distinct nvl(l.audids, '')))
                           from   $nagruzka_lec l
                           where l.stream        = t.potok_sem
                           and   l.nagtypeid = 3
                       ) as ROOMID,
                       (
                           select
                                  --to_char(wm_concat(distinct '\"teacherId\"=>' || nvl(l.prepid_lec, '0')))
                                  to_char(wm_concat(distinct nvl(l.prepid, '')))
                           from   $nagruzka_lec l
                           where l.stream = t.potok_sem
                           and   l.nagtypeid = 3
                           group by l.stream
                       ) as TEACHERID,
                       (
                           select
                                  max(l.tso)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_sem
                           and   l.nagtypeid = 3
                       ) as TSO,
                       (
                           select
                                  max(l.build)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_sem
                           and   l.nagtypeid = 3
                       ) as BUILD,
                       (
                           select
                                  max(l.lvl)
                           from   $nagruzka_lec l
                           where l.stream = t.potok_sem
                           and   l.nagtypeid = 3
                       ) as LVL
                from $nagruzka t,
                     groups    gr
                where t.studyid = '$studyId'
                and   t.divid   = '$divId'
                and   gr.groid  = t.groid
                and   gr.quaid <> 3
                and   t.potok_sem <> 0
                and (case when t.sem > 0 then '3' end) is not null
                group by t.potok_sem
            ";
        try {
            $cur = execq($query, false);
            foreach ($cur as $i => $row) {
                $output[$i]['STREAM'] = $row['STREAM'];
                $output[$i]['TYPEID'] = $row['TYPEID'];
                $output[$i]['GROUPID'] = explode(",", $row['GROUPID']);
                $output[$i]['NAGID'] = explode(",", $row['NAGID']);
                $output[$i]['RASPREDID'] = explode(",", $row['RASPREDID']);
                $output[$i]['SUBJECTID'] = $row['SUBJECTID'];
                $output[$i]['ROOMID'] = explode(",", $row['ROOMID']);
                $output[$i]['TEACHERID'] = explode(",", $row['TEACHERID']);
                $output[$i]['TSO'] = $row['TSO'];
                $output[$i]['BUILD'] = $row['BUILD'];
                $output[$i]['LEVEL'] = $row['LVL'];
            }
            //echo '{rows:' . json_encode($output) . '}';
        } catch (Exception $e) {
            $success = false;
            echo json_encode(
                array('success' => $success,
                    'message' => $query));
        }
        if ($success) {
            echo json_encode(array('rows' => $output));
        }
        break;

    // * при удалении строки потока
    case 'destroy':
        $typeId = $data['typeId'];
        $nagId = $data['nagId'];
        $teacherId = $data['teacherId'];
        $stream = $data['stream'];

        if ($nagId.length) {
            // уберем potok_lek из nagruzka
            foreach ($nagId as $i => $row) {
                switch ($typeId) {
                    case 1:
                        $query = "update $nagruzka n
                                      set n.potok_lek = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                        break;
                    case 2:
                        $query = "update $nagruzka n
                                      set n.potok_lab = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                        break;
                    case 3:
                        $query = "update $nagruzka n
                                      set n.potok_sem = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                        break;
                }
                try {
                    $result = oci_parse($conn, $query);
                    if (!(oci_execute($result))) throw new Exception;
                    oci_free_statement($result);
                } catch (Exception $e) {
                    $success = false;
                    echo json_encode(
                        array('success' => $success,
                            'message' => $query));
                }
            }

            // * нужно оставить одну запись в таблице nagruzka_raspred, остальные- удалить
            // * поля stream, rooms, audids, prepid нужно очистить
            reset($nagId);

            foreach ($nagId as $i => $row) {
                for ($j = 0; $j < count($teacherId); $j++) {
                    // * для первой записи - обновление, для остальных - удаление
                    if ($j == 0) {
                        $tchr = $teacherId[$j];
                        $query = "update $nagruzka_lec l
                                  set l.stream = null,
                                      l.audids = null,
                                      l.rooms = null,
                                      l.prepid = null
                                  where l.nagid = '$row'
                                  and   l.nagtypeid = '$typeId'
                                  and   l.prepid = '$tchr'
                                  and   l.stream = '$stream'";
                        try {
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        } catch (Exception $e) {
                            $success = false;
                            echo json_encode(
                                array('success' => $success,
                                    'message' => $query));
                        }
                    } else {
                        $tchr = $teacherId[$j];
                        $query = "delete from $nagruzka_lec l
                                      where l.prepid = '$tchr'
                                      and   l.nagid = '$row'
                                      and   l.nagtypeid = '$typeId'
                                      and   l.stream = '$stream'";
                        try {
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        } catch (Exception $e) {
                            $success = false;
                            echo json_encode(
                                array('success' => $success,
                                    'message' => $query));
                        }
                    }
                }
            }
        }
        if ($success) {
            echo json_encode(array('success' => $success,
                'message' => 'ok'));
        }
        break;
    case 'create':
        $success = false;
        echo json_encode(array('success' => $success));
        break;

    // * при удалении группы из потока
    case 'update':
        $typeId = $data['typeId'];
        $deleted_nagid = $data['deleted_nagid']; // nagid удаленных групп из потока
        $nagId = $data['nagId'];
        $raspredId = $data['raspredId'];
        $teacherArray = $data['teacherId'];
        $roomId = $data['roomId'];
        $tso = $data['tso'];
        $level = $data['level'];
        $build = $data['build'];
        $stream = $data['stream'];
        $subjectId = $data['subjectId'];

        // если удалили группы из потока
        if ($deleted_nagid) {
            // уберем potok_lek и potok_couid из nagruzka
            try {
                switch ($typeId) {
                    case 1:
                        foreach ($deleted_nagid as $i => $row) {
                            $query = "update $nagruzka n
                                      set n.potok_lek = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        }
                        break;
                    case 2:
                        foreach ($deleted_nagid as $i => $row) {
                            $query = "update $nagruzka n
                                      set n.potok_lab = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        }
                        break;
                    case 3:
                        foreach ($deleted_nagid as $i => $row) {
                            $query = "update $nagruzka n
                                      set n.potok_sem = null,
                                          n.potok_couid = null
                                      where n.nagid = '$row'";
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        }
                        break;
                    // todo запретить добавлять группу в поток, если она уже есть в потоке по данному предмету
                }
            } catch (Exception $e) {
                $success = false;
                echo json_encode(
                    array('success' => $success,
                        'message' => $query));
            }

            // * нужно оставить одну запись в таблице nagruzka_raspred.
            // * поля stream, rooms, audids, prepid нужно очистить
            reset($deleted_nagid);

            foreach ($deleted_nagid as $i => $row) {
                for ($j = 0; $j < count($teacherArray); $j++) {
                    // * для первой записи - обновление, для остльных - удаление
                    if ($j == 0) {
                        $tchr = $teacherArray[$j];
                        $query = "update $nagruzka_lec l
                                  set l.stream = null,
                                      l.audids = null,
                                      l.rooms = null,
                                      l.prepid = null
                                  where l.nagid = '$row'
                                  and   l.nagtypeid = '$typeId'
                                  and   l.prepid = '$tchr'
                                  and   l.stream = '$stream'";
                        try {
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        } catch (Exception $e) {
                            $success = false;
                            echo json_encode(
                                array('success' => $success,
                                    'message' => $query));
                        }
                    } else {
                        $tchr = $teacherArray[$j];
                        $query = "delete from $nagruzka_lec l
                                      where l.prepid = '$tchr'
                                      and   l.nagid = '$row'
                                      and   l.nagtypeid = '$typeId'
                                      and   l.stream = '$stream'";
                        try {
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;
                            oci_free_statement($result);
                        } catch (Exception $e) {
                            $success = false;
                            echo json_encode(
                                array('success' => $success,
                                    'message' => $query));
                        }
                    }
                }
            }
            if ($success) {
                echo json_encode(array('success' => $success,
                    'message' => 'updated'));
            }
        } else {
            if ($success) {
                echo json_encode(array('success' => $success,
                    'message' => 'did nothing'));
            }
        }

        break;

    // добавление записи о группе в таблицы нагрузки
    case 'addGroup':
        $nagId = $_REQUEST['nagId'];
        $groupId = $_REQUEST['groupId'];
        $stream = $_REQUEST['stream'];
        $subjectId = $_REQUEST['subjectId'];
        $teacherArray = explode(',', $_REQUEST['teacherId']);
        $roomId = $_REQUEST['roomId'];
        $roomsArray = explode(',', $_REQUEST['roomId']);
        $typeId = $_REQUEST['typeId'];
        $build = $_REQUEST['build'];
        $level = $_REQUEST['level'];
        $tso = $_REQUEST['tso'];
        $raspredId = $_REQUEST['raspredId'];


        if ($groupId && $nagId && $teacherArray && $subjectId && $stream) {
            // обновим таблицу NAGRUZKA

            switch ($typeId) {
                case 1:
                    $query = "update $nagruzka n
                                      set n.potok_lek = '$stream',
                                      n.potok_couid = '$subjectId'
                                      where n.nagid = '$nagId'";
                    break;
                case 2:
                    $query = "update $nagruzka n
                                      set n.potok_lab = '$stream',
                                      n.potok_couid = '$subjectId'
                                      where n.nagid = '$nagId'";
                    break;
                case 3:
                    $query = "update $nagruzka n
                                      set n.potok_sem = '$stream',
                                      n.potok_couid = '$subjectId'
                                      where n.nagid = '$nagId'";
                    break;
            }
            try {
                $result = oci_parse($conn, $query);
                if (!(oci_execute($result))) throw new Exception;
                oci_free_statement($result);
            } catch (Exception $e) {
                $success = false;
                echo json_encode(array('success' => $success,
                    'query' => $query
                ));
            }

            /*            // * переведем аудитории в удобочитаемый вид (строку вида 1207,1401...)
                        $roomsString = '';

                        $query = "select a.roomnumber as ROOM
                                              from AUDITOR_FULL a
                                              where a.audid in ($roomId)";
                        try {
                            $result = oci_parse($conn, $query);
                            if (!(oci_execute($result))) throw new Exception;

                            while ($row = oci_fetch_array($result, OCI_ASSOC)) {
                                $output[] = $row['ROOM'];
                            }

                            $roomsString = implode(',', $output);
                            oci_free_statement($result);
                        } catch (Exception $e) {
                            $success = false;
                            echo json_encode(
                                array('success' => $success,
                                    'message' => $query));
                        }*/

            // * update the table $nagruzka_lec
            // * для первого преподавателя- обновляем имеющуюся запись
            // * для других преподов- добавим еще записи
            $tchr = $teacherArray[0];

            $query = "update $nagruzka_lec l
                                  set l.stream = '$stream',
                                      l.nagtypeid = '$typeId',
                                      l.prepid = '$tchr',
                                      l.audids = '$roomId',
                                      --l.rooms = '$roomsString',
                                      l.tso = '$tso',
                                      l.build = '$build',
                                      l.lvl = '$level'
                                  where l.id = '$raspredId'";
            try {
                $result = oci_parse($conn, $query);
                if (!(oci_execute($result))) throw new Exception;
                oci_free_statement($result);
            } catch (Exception $e) {
                $success = false;
                echo json_encode(
                    array('success' => $success,
                        'message' => $query));
            }

            // если несколько преподавателей- добавим запись в $nagruzka_lec
            if (count($teacherArray) > 1) {
                for ($i = 1; $i < count($teacherArray); $i++) {
                    $tchr = $teacherArray[$i];

                    $query = "insert into $nagruzka_lec l
                              (l.nagid,
                              l.stream,
                              l.nagtypeid,
                              l.prepid,
                              l.audids,
                              --l.rooms,
                              l.tso,
                              l.build,
                              l.lvl)
                              values
                              ('$nagId',
                              '$stream',
                              '$typeId',
                              '$tchr',
                              '$roomId',
                              --'$roomsString',
                              '$tso',
                              '$build',
                              '$level')";
                    try {
                        $result = oci_parse($conn, $query);
                        if (!(oci_execute($result))) throw new Exception;
                        oci_free_statement($result);
                    } catch (Exception $e) {
                        $success = false;
                        echo json_encode(
                            array('success' => $success,
                                'message' => $query));
                    }
                }
            }
        }

        if ($success) {
            echo json_encode(array('success' => $success,
                'message' => 'ok'));
        }
        break;
}

if ($conn)
    oci_close($conn);

/*function Create($aRecords)
{
    // $aRecords might be a single object or an array of objects. Ensure it's wrapped as an array.
    $this->EnsureArray($aRecords);

    foreach ($aRecords as $aRecord)
    {
        $iInsertClause = InsertClause::FromObject( $aRecord, self::$persistents );

        sql("INSERT INTO ItemInCategory $iInsertClause");

        // Return the record with the newly inserted record id
        $aRecord->id = mysql_insert_id();
    }

    return array(
        'success' => true,
        'data'    => $aRecords,
    );
}*/


?>

