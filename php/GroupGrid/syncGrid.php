<?
require_once("./../../include.php");

$data = json_decode(file_get_contents('php://input'), true);

$studyId = $_REQUEST['studyId'];
$grade = $_REQUEST['grade'];
$divId = $_REQUEST['divId'];
$subjectId = $_REQUEST['subjectId'];
$success = true;

// актуальные таблицы
$nagruzka = $_REQUEST['nagruzka'];
$nagruzka_lec = $_REQUEST['nagruzka_lec'];
$nagruzka_lab = $_REQUEST['nagruzka_labs'];
$nagruzka_sem = $_REQUEST['nagruzka_sem'];
$nagruzka_rep = $_REQUEST['nagruzka_rep'];

$magi = "(SELECT G.GROCODE,
                              G.GROID,
                              G.DIFID,
                              G.FACID,
                              substr(g.difcode, -2, 2) as difcode,
                              3 AS Quaid
                        FROM  GROUPS        G
                        WHERE G.QUAID = 3
                        AND   G.ARHIV = 0
                        AND NVL (G.DIFID, 0) <> 0
                       UNION
                       SELECT GD.GROCODE,
                              GD.GROID,
                              GD.DIFID,
                              G.FACID,
                              substr(GD.difcodenew, -2, 2) as difcode,
                              3 AS Quaid
                         FROM GROUPS_DIFCODE GD,
                              GROUPS         G
                        WHERE G.GROID = GD.GROID
                        AND   G.QUAID = 3
                        AND   G.ARHIV = 0)";

switch ($_REQUEST['act']) {
// create
    case 'create':
        $groupId = $data['groupId'];
        $nagId = $data['nagId'];
        $roomId = implode(',', $data['roomId']);
        $stream = $data['stream'];
        $teacherId = $data['teacherId'];
        $typeId = $data['typeId'];
        $hourFact = $data['hourFact'];
        $id = $data['id'];

        switch ($typeId) {
            case '1':
                $query = "insert
                              into $nagruzka_lec l
                              (nagid, prepid, audids, nagtypeid, stream)
                              values
                              ('$nagId', '$teacherId', '$roomId', 1, '$stream')";
                break;
            case '2':
                $query = "insert
                              into $nagruzka_lab l
                              --(nagid, prepid_lec, room_lec, potok_lek)
                              (nagid, prepid, audids, nagtypeid, stream)
                              values
                              ('$nagId', '$teacherId', '$roomId', 2, '$stream')";
                break;
            case '3':
                $query = "insert
                              into $nagruzka_sem l
                              (nagid, prepid, audids, nagtypeid, stream)
                              values
                              ('$nagId', '$teacherId', '$roomId', 3, '$stream')";
                break;
            case '4':
                // может нужная запись уже есть в таблице nagruzka_rep, тогда ее нужно обновить
                $query = "insert
                              into $nagruzka_rep r
                              (nagid, prepid, N4)
                              values
                              ('$nagId', '$teacherId', nvl('$hourFact', 0))";
                break;
            case '5':
                $query = "insert
                              into $nagruzka_rep r
                              (nagid, prepid, N5)
                              values
                              ('$nagId', '$teacherId', nvl('$hourFact', 0))";
                break;
            case '6':
                $query = "insert
                              into $nagruzka_rep r
                              (nagid, prepid, N7)
                              values
                              ('$nagId', '$teacherId', nvl('$hourFact', 0))";
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

        /*switch ($typeId) {
            case '1':
            case '2':
            case '3':
                $query_id = "select
                              SEQ_NAGRUZKA_RASPRED.currval as last_id
                              from dual";
                break;
            case '4':
            case '5':
            case '6':
                $query_id = "select
                              seq_nagruzka_30032013_rep.currval as last_id
                              from dual";
                break;
        }

        try {
            $result = oci_parse($conn, $query_id);
            if (!(oci_execute($result))) throw new Exception;
            while ($row = oci_fetch_array($result, OCI_ASSOC)) {
                $output[] = $row;
            }
            oci_free_statement($result);
            echo '{"success": true, "message": ' . $output[0]['LAST_ID'] . '}';
        } catch (Exception $e) {
            echo json_encode(
                array('success' => false,
                    'message' => $query));
        }*/

        if($success){
            echo json_encode(array('success' => $success,
                'message' => 'ok'));
        }
        break;
// read
    case 'read':
        $query = "
                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lec > 0 then '1' end)   as TYPEID,
                  (case when t.lec > 0 then t.lec end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lek, 0, null, t.potok_lek) as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_lec l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 1
                and (case when t.lec > 0 then '1' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lec > 0 then '1' end)   as TYPEID,
                  (case when t.lec > 0 then t.lec end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lek, 0, null, t.potok_lek)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_lec l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 1
                and (case when t.lec > 0 then '1' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lec > 0 then '1' end)   as TYPEID,
                  (case when t.lec > 0 then t.lec end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lek, 0, null, t.potok_lek)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_lec l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 1
                and (case when t.lec > 0 then '1' end) is not null

                union

                -- Лабы --
                
                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lab > 0 then '2' end)   as TYPEID,
                  (case when t.lab > 0 then t.lab end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lab, 0, null, t.potok_lab)  as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_lab l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 2
                and (case when t.lab > 0 then '2' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lab > 0 then '2' end)   as TYPEID,
                  (case when t.lab > 0 then t.lab end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lab, 0, null, t.potok_lab)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_lab l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 2
                and (case when t.lab > 0 then '2' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.lab > 0 then '2' end)   as TYPEID,
                  (case when t.lab > 0 then t.lab end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_lab, 0, null, t.potok_lab)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_lab l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 2
                and (case when t.lab > 0 then '2' end) is not null
                
                union

                -- Семинары --

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.sem > 0 then '3' end)   as TYPEID,
                  (case when t.sem > 0 then t.sem end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_sem, 0, null, t.potok_sem)  as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_sem l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 3
                and (case when t.sem > 0 then '3' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.sem > 0 then '3' end)   as TYPEID,
                  (case when t.sem > 0 then t.sem end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_sem, 0, null, t.potok_sem)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_sem l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 3
                and (case when t.sem > 0 then '3' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  l.id      as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when t.sem > 0 then '3' end)   as TYPEID,
                  (case when t.sem > 0 then t.sem end) as HOURALL,
                  null         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  l.prepid     as TEACHERID,
                  l.audids      as ROOMID,
                  decode(t.potok_sem, 0, null, t.potok_sem)  as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_sem l
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   l.nagid(+) = t.nagid
                and   l.nagtypeid = 3
                and (case when t.sem > 0 then '3' end) is not null

                union

                -- КП V4 --

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v4, 0) > 0 then '4' end)  as TYPEID,
                  (case when nvl(t.v4, 0) > 0 then nvl(t.v4, 0) end) as HOURALL,
                  r.N4         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   r.nagid(+) = t.nagid
                and   r.N4 is not null
                and (case when nvl(t.v4, 0) > 0 then '4' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v4, 0) > 0 then '4' end)  as TYPEID,
                  (case when nvl(t.v4, 0) > 0 then nvl(t.v4, 0) end) as HOURALL,
                  r.N4         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   r.nagid(+) = t.nagid
                and   r.N4 is not null
                and (case when nvl(t.v4, 0) > 0 then '4' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v4, 0) > 0 then '4' end)  as TYPEID,
                  (case when nvl(t.v4, 0) > 0 then nvl(t.v4, 0) end) as HOURALL,
                  r.N4         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   r.nagid(+) = t.nagid
                and   r.N4 is not null
                and (case when nvl(t.v4, 0) > 0 then '4' end) is not null

                union
                -- КР V5 --

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v5, 0) > 0 then '5' end)  as TYPEID,
                  (case when nvl(t.v5, 0) > 0 then nvl(t.v5, 0) end) as HOURALL,
                  r.N5         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   r.nagid(+) = t.nagid
                and   r.N5 is not null
                and (case when nvl(t.v5, 0) > 0 then '5' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v5, 0) > 0 then '5' end)  as TYPEID,
                  (case when nvl(t.v5, 0) > 0 then nvl(t.v5, 0) end) as HOURALL,
                  r.N5         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   r.nagid(+) = t.nagid
                and   r.N5 is not null
                and (case when nvl(t.v5, 0) > 0 then '5' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v5, 0) > 0 then '5' end)  as TYPEID,
                  (case when nvl(t.v5, 0) > 0 then nvl(t.v5, 0) end) as HOURALL,
                  r.N5         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   r.nagid(+) = t.nagid
                and   r.N5 is not null
                and (case when nvl(t.v5, 0) > 0 then '5' end) is not null

                union
                -- ГЭ V6 --

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  gr.grocode
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v7, 0) > 0 then '6' end)  as TYPEID,
                  (case when nvl(t.v7, 0) > 0 then nvl(t.v7, 0) end) as HOURALL,
                  r.N7         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     groups gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid <> 3
                and   r.nagid(+) = t.nagid
                and   r.N7 is not null
                and (case when nvl(t.v7, 0) > 0 then '6' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v7, 0) > 0 then '6' end)  as TYPEID,
                  (case when nvl(t.v7, 0) > 0 then nvl(t.v7, 0) end) as HOURALL,
                  r.N7         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.difid = t.difid
                and   gr.quaid = 3
                and   t.difid <> 0
                and   r.nagid(+) = t.nagid
                and   r.N7 is not null
                and (case when nvl(t.v7, 0) > 0 then '6' end) is not null

                union

                select
                  t.nagid   as NAGID,
                  r.repid   as ID,
                  t.groid   as GROUPID,
                  (case when gr.difcode is not null
                        then gr.grocode
                             || ' ('
                             || substr(gr.difcode, -2, 2)
                             || ')'
                        else gr.grocode
                   end)
                    || ' [' || nvl(t.kolvo_fact, kolvo) || ']'
                        as GROUPNAME,
                  (case when nvl(t.v7, 0) > 0 then '6' end)  as TYPEID,
                  (case when nvl(t.v7, 0) > 0 then nvl(t.v7, 0) end) as HOURALL,
                  r.N7         as HOURFACT,
                  t.subgroup   as SUBGROUP,
                  r.prepid     as TEACHERID,
                  null         as ROOMID,
                  null         as STREAM
                from $nagruzka t,
                     $magi gr,
                     $nagruzka_rep r
                where t.studyid = '$studyId'
                and   t.kurs = '$grade'
                and   t.divid = '$divId'
                and   t.couid = '$subjectId'
                and   gr.groid = t.groid
                and   gr.quaid = 3
                and   t.difid = 0
                and   r.nagid(+) = t.nagid
                and   r.N7 is not null
                and (case when nvl(t.v7, 0) > 0 then '6' end) is not null

                order by GROUPNAME
            ";
//echo $query;
        /*$result = oci_parse($conn, $query);

        if (!(oci_execute($result))) throw new Exception;
        while ($row = oci_fetch_array($result, OCI_ASSOC)) {
            $output[] = $row;
        }
        oci_free_statement($result);*/
        $cur = execq($query, false);
        foreach ($cur as $i => $row) {
            $output[$i]['NAGID'] = $row['NAGID'];
            $output[$i]['ID'] = $row['ID'];
            $output[$i]['GROUPID'] = $row['GROUPID'];
            $output[$i]['GROUPNAME'] = $row['GROUPNAME'];
            $output[$i]['TYPEID'] = $row['TYPEID'];
            $output[$i]['HOURALL'] = $row['HOURALL'];
            $output[$i]['HOURFACT'] = $row['HOURFACT'];
            $output[$i]['SUBGROUP'] = $row['SUBGROUP'];
            $output[$i]['TEACHERID'] = $row['TEACHERID'];
            $output[$i]['ROOMID'] = explode(",", $row['ROOMID']);
            $output[$i]['STREAM'] = $row['STREAM'];
        }

        echo '{rows:' . json_encode($output) . '}';
        break;
// update
    case 'update':
        $typeId = $data['typeId'];
        $id = $data['id'];
        $teacherId = $data['teacherId'];
        $hourFact = $data['hourFact'];
        $roomId = implode(',', $data['roomId']);
        $stream = $data['stream'];

        switch ($typeId) {
            case '1':
                $query = "update $nagruzka_lec l
                              set l.prepid = '$teacherId',
                                  --l.rooms  = '$roomId',
                                  l.audids  = '$roomId',
                                  l.stream  = '$stream'
                              where l.id = '$id'";
                break;
            case '2':
                $query = "update $nagruzka_lab l
                              set l.prepid = '$teacherId',
                                  --l.rooms  = '$roomId',
                                  l.audids  = '$roomId',
                                  l.stream  = '$stream'
                              where l.id = '$id'";
                break;
            case '3':
                $query = "update $nagruzka_sem l
                              set l.prepid = '$teacherId',
                                  --l.rooms  = '$roomId',
                                  l.audids  = '$roomId',
                                  l.stream  = '$stream'
                              where l.id = '$id'";
                break;
            case '4':
                $query = "update $nagruzka_rep r
                              set r.N4     = nvl('$hourFact', 0),
                                  r.prepid = '$teacherId'
                              where r.repid = '$id'";
                break;
            case '5':
                $query = "update $nagruzka_rep r
                              set r.N5     = nvl('$hourFact', 0),
                                  r.prepid = '$teacherId'
                              where r.repid = '$id'";
                break;
            case '6':
                $query = "update $nagruzka_rep r
                              set r.N7     = nvl('$hourFact', 0),
                                  r.prepid = '$teacherId'
                              where r.repid = '$id'";
                break;

        }
        //echo $query;
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
        if($success){
            echo json_encode(array('success' => $success,
                'message' => 'ok'));
        }
        break;
// destroy
    case 'destroy':
        $typeId = $data['typeId'];
        $id = $data['id'];

        switch ($typeId) {
            case '1':
                $query = "delete
                            from $nagruzka_lec l
                            where l.id = '$id'";
                break;
            case '2':
                $query = "delete
                              from $nagruzka_lab l
                              where l.id = '$id'";
                break;
            case '3':
                $query = "delete
                              from $nagruzka_sem l
                              where l.id = '$id'";
                break;
            case '4':
                $query = "delete
                              from $nagruzka_rep l
                              where l.repid = '$id'";
                break;
            case '5':
                $query = "delete
                              from $nagruzka_rep l
                              where l.repid = '$id'";
                break;
            case '6':
                $query = "delete
                              from $nagruzka_rep l
                              where l.repid = '$id'";
                break;

        }
        try {
            $result = oci_parse($conn, $query);
            if (!(oci_execute($result))) throw new Exception;
            oci_free_statement($result);
        } catch (Exception $e) {
            $success = false;
            echo json_encode(
                array('success' => false,
                    'message' => $query));
        }
        if($success){
            echo json_encode(array('success' => $success,
                'message' => 'ok'));
        }
        break;
}

if ($conn)
    oci_close($conn);
?>