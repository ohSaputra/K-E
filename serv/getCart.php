<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM delivery a INNER JOIN restaurant b WHERE a.restaurant_id = ".$_GET['restaurant_id'].
        " AND b.restaurant_id=a.restaurant_id", $db);


    $json_response = array();
   
    
    while ($row = mysql_fetch_assoc($result)) {

        $response = array(
                "delivery_type" => $row['delivery_type'],
                "delivery_charge" => $row['delivery_charge'],
                "delivery_charge2" => $row['delivery_charge2'],
                "limit_transaction" => $row['limit_transaction'],
                "service_charge" => $row['service_charge']
        );
        
        array_push($json_response, $response);
    }
    
    echo $_GET['callback'].'({ "cart" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>