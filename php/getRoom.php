<?
require_once("./../include.php");
/*require_once('../PhpConsole.php');
PhpConsole::start();*/

try {
    $query = "
		select
		  audid      as ID,
		  roomnumber as NAME,
		  substr(abbreviation,0,1) as BUILD,
		  decode(substr(abbreviation,0,1),
		    1, substr(roomnumber,1,1),
		    2, substr(roomnumber,2,1),
		    3, substr(roomnumber,2,1)
		  ) as LVL,
		  decode(gadget,
		    null, 0,
		    1, 1
		  ) as TSO
		from AUDITOR_FULL
		order by audid
	";

    $result = oci_parse($conn, $query);

    if(!(oci_execute($result))) throw new Exception;
    while($row = oci_fetch_array($result, OCI_ASSOC)){
        $output[] = $row;
    }
    oci_free_statement($result);

    echo '{rows:' . json_encode($output) . '}';
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}

?>