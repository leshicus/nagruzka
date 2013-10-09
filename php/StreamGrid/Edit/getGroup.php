<?
require_once("./../../../include.php");

$studyId = $_REQUEST['studyId'];
$divid = $_REQUEST['divId'];
$nagruzka = $_REQUEST['nagruzka'];

try {
    /*$output = array(
        array("ID"=>"1", "NAME"=>"АС-11-04"),
        array("ID"=>"2", "NAME"=>"АС-11-05"),
        array("ID"=>"3", "NAME"=>"АС-10-04")
    );*/

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

    $result = oci_parse($conn, $query);

    if (!(oci_execute($result))) throw new Exception;
    while ($row = oci_fetch_array($result, OCI_ASSOC)) {
        $output[] = $row;
    }
    oci_free_statement($result);

    echo '{rows:' . json_encode($output) . '}';
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}

?>