<?
require_once("../include.php");

$studyId = $_REQUEST['studyId'];
$divid = $_REQUEST['divId'];
$nagruzka = $_REQUEST['nagruzka'];

$query = "
		select distinct
              gr.groid   as ID,
              gr.grocode as NAME
        from $nagruzka t,
             groups    gr
        where t.studyid = '$studyId'
        and   t.divid   = '$divid'
        and   gr.groid = t.groid
        order by gr.groid
	";

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