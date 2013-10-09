<?php

require_once("../include.php");

$manid = $_REQUEST['manid'];
$taskid = $_REQUEST['taskid'];
$success = true;


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
    $result = oci_parse($conn, $query);

    if (!(oci_execute($result)))
        throw new Exception;
    while ($row = oci_fetch_array($result, OCI_ASSOC)) {
        $output[] = $row;
    }
    oci_free_statement($result);

} catch (Exception $e) {
    $success = false;
    echo json_encode(
        array('success' => $success,
            'message' => $query));
}

if ($success) {
    echo '{rows:' . json_encode($output) . '}';
}

if ($conn)
    oci_close($conn);

?>