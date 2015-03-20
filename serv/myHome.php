<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);

    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM address WHERE address_id=".$_GET['address_id'], $db);
   
    $json_response = array();
    
    while ($row = mysql_fetch_assoc($result)) {
        $response = array(
                "address_id" => $row['address_id'], 
                "address_type" => $row['address_type'],
                "address_name" => $row['address_name'],
                "tower_division" => $row['tower_division'],
                "floor" => $row['floor'],
                "room_unit" => $row['room_unit'],
                "address_content" => $row['address_content'],
                "address_note" => $row['address_note'],
                "building" => $row['building']
        );

        array_push($json_response, $response);
    }
    
    echo $_GET['callback'].'({ "address_detail" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>