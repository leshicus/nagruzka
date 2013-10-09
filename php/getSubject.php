<?
require_once("./../include.php");

/*$divid = $_REQUEST['divid'];
$grade = $_REQUEST['grade'];*/
$studyId = $_REQUEST['studyId'];

try {
    $query = "
        select
          t.couid   as ID,
          max(c.coudiplom) as NAME,
          t.kurs    as GRADE,
          t.divid   as DIVID,
          max(t.nagid)   as NAGID
        from NAGRUZKA_30032013 t,
             COURSE            c,
             groups            g
        where t.studyid = '$studyId'
        and   t.couid = c.couid
        and   g.groid = t.groid
        and   g.quaid <> 3
        group by t.couid, t.divid, t.kurs

        union

        select
          t.couid   as ID,
          '(м) ' || max(c.coudiplom) as NAME,
          t.kurs    as GRADE,
          t.divid   as DIVID,
          max(t.nagid)   as NAGID
        from NAGRUZKA_30032013 t,
             COURSE            c,
             groups            g
        where t.studyid = '$studyId'
        and   t.couid = c.couid
        and   g.groid = t.groid
        and   g.quaid = 3
        group by t.couid, t.divid, t.kurs

        order by Name
	";

    $result = oci_parse($conn, $query);

    if(!(oci_execute($result))) throw new Exception;

    while($row = oci_fetch_array($result, OCI_ASSOC)){
        $output[] = $row;
    }

    echo '{rows:' . json_encode($output) . '}';
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}
if ($conn)
    oci_close($conn);
?>