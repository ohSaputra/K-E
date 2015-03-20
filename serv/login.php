<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);

    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM customer WHERE customer_email = '".$_GET['email']."' 
        AND password ='".sha1($_GET['password'])."' LIMIT 1", $db);

    $json_response = array();
    $json_response2 = array();
   
    
    while ($row = mysql_fetch_assoc($result)) {

        $response = array(
                "customer_id" => $row['customer_id'],
                "customer_name" => $row['customer_name'],
                "customer_email" => $row['customer_email'],
                "password" => $row['password']
        );
        

        array_push($json_response, $response);
    }

    $result2 = mysql_query("SELECT * FROM address WHERE customer_id=".$json_response[0]['customer_id']." AND address_status=1", $db);

    while ($row2 = mysql_fetch_assoc($result2)) {
        $response2 = array(
            "address_id" => $row2['address_id'],
            "location" => $row2["delivery_area"]
        );

        array_push($json_response2, $response2);
    }
    
    echo $_GET['callback'].'({ "login" : '.json_encode($json_response).', "address" : '.json_encode($json_response2).' })';
    
    //Close the database connection
    fclose($db);

?>