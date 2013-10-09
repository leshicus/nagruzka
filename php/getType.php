<?

try {
    $output = array(
        array("ID"=>"1", "NAME"=>"Лекция"),
        array("ID"=>"2", "NAME"=>"Лабораторная"),
        array("ID"=>"3", "NAME"=>"Семинар"),
        array("ID"=>"4", "NAME"=>"КП"),
        array("ID"=>"5", "NAME"=>"КР"),
        array("ID"=>"6", "NAME"=>"ГЭ")
    );
    echo '{rows:' . json_encode($output) . '}';
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}

?>