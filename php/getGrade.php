<?
for($i=0; $i<5; $i++){
    $output[$i] = array("ID"=>"$i", "NAME"=>"$i"+1);
}

echo '{rows:' . json_encode($output) . '}';
?>