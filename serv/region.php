<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("select * from region where region_status = 1", $db);


    $json_response = array();
   
    
    while ($row = mysql_fetch_assoc($result)) {
        $response = array(
                "region_id" => $row['region_id'], 
                "region_name" => $row['region_name']
        );
        array_push($json_response, $response);
    }
    

    echo $_GET['callback'].'({ "region" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>