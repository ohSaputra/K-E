<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM restaurant WHERE restaurant_id = ".$_GET['restaurant_id'], $db);

    $json_response = array();
    
    while ($row = mysql_fetch_assoc($result)) {
        $names = explode("@", $row['restaurant_name']);
        $start = explode(":", $row['delivery_hours_start']);
        $end = explode(":", $row['delivery_hours_end']);
        $time = $start[0].':'.$start[1].' - '.$end[0].':'.$end[1];
        $response = array(
                "restaurant_id" => $row['restaurant_id'], 
                "restaurant_firstname" => $names[0],
                "restaurant_lastname" => $names[1],
                "logo_image" => $row['logo_image2'],
                "time" => $time
        );
    }
    

    echo $_GET['callback'].'({ "restaurant" : '.json_encode($response).' })';
    
    //Close the database connection
    fclose($db);

?>