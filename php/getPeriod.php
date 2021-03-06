<?php
require_once("../include.php");

$manid = $_REQUEST['manid'];
$taskid = $_REQUEST['taskid'];

$query = "
	select V.STUDYID as ID,
           V.YEARNAME || ' ' || V.PERIODNAME as NAME
        from V_STUDY      V,
             STUDY_ACCESS A
        where V.arhiv <> 1
        and   V.studyid in A.studyid
        and   A.manid = '$manid'
        and   A.taskid = '$taskid'
        order by V.studyid
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