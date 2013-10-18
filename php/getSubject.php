<?
require_once("./../include.php");

$divid = $_REQUEST['divid'];
$studyId = $_REQUEST['studyId'];

$str .= ' and t.studyid = '.$studyId.' ';
if($divid)
    $str .= ' and t.divid = '.$divid.' ';

$query = "
        select
          t.couid   as ID,
          max(c.coudiplom) as NAME,
          t.kurs    as GRADE,
          t.divid   as DIVID,
          max(t.nagid)   as NAGID
        from $nagruzka t,
             COURSE            c,
             groups            g
        where t.couid = c.couid
        ".$str."
        and   g.groid = t.groid
        and   g.quaid <> 3
        group by t.couid, t.divid, t.kurs

        union all

        select
          t.couid   as ID,
          '(м) ' || max(c.coudiplom) as NAME,
          t.kurs    as GRADE,
          t.divid   as DIVID,
          max(t.nagid)   as NAGID
        from $nagruzka t,
             COURSE            c,
             groups            g
        where t.couid = c.couid
        ".$str."
        and   g.groid = t.groid
        and   g.quaid = 3
        group by t.couid, t.divid, t.kurs

        order by Name
	";
//echo $query;
try {
    $result = execq($query, false);
    foreach ($result as $i => $data)
        foreach ($data as $k => $v)
            $output[$i][strtolower($k)] = $v;
} catch (Exception $e) {
    $success = false;
    echo json_encode(
        array('success' => $success,
            'message' => $query));
}
if ($success) {
    echo '{rows:' . json_encode($output) . '}';
}

?>