<?
for($i=0; $i<5; $i++){
    $output[$i] = array("id"=>"$i", "name"=>"$i"+1);
}

echo '{rows:' . json_encode($output) . '}';
?>