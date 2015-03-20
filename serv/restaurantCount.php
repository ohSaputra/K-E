<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT count(b.location_id) AS Total FROM restaurant_delivery a INNER JOIN restaurant b WHERE b.restaurant_status = 1 AND a.restaurant_id = b.restaurant_id AND a.location_id = ".$_GET['location_id'], $db);


    $json_response = array();
   
    
    while ($row = mysql_fetch_assoc($result)) {
        $response = array(
                "count" => $row['Total']
        );
        array_push($json_response, $response);
    }
    

    echo $_GET['callback'].'({ "restaurant_count" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>