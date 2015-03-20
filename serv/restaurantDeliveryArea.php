<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM restaurant a INNER JOIN restaurant_delivery b, location c WHERE a.restaurant_id = ".$_GET['restaurant_id']." 
        AND b.restaurant_id = a.restaurant_id AND c.location_id = b.location_id AND c.location_status = 1", $db);

    $json_response = array();
    
    while ($row = mysql_fetch_assoc($result)) {
        $names = explode("@", $row['restaurant_name']);
        $start = explode(":", $row['delivery_hours_start']);
        $end = explode(":", $row['delivery_hours_end']);
        $time = $start[0].':'.$start[1].' - '.$end[0].':'.$end[1];
        $response = array(
                "location_name" => $row['location_name']
        );
        array_push($json_response, $response);
    }
    

    echo $_GET['callback'].'({ "restaurant_delivery" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>