<?php
    header("Access-Control-Allow-Origin: *");
    //Create Database connection
    $hostname_config = "127.0.0.1";
    $database_config = "klikeat";
    $username_config = "root";
    $password_config = "";
    $config = new mysqli($hostname_config,$username_config,$password_config,$database_config);
    
    $response = array();

    $response = json_decode(file_get_contents('php://input'), true);
    $name = $response['cust_name'];
    $email = $response['email'];
    $password = sha1($response['password']);
    
    //Replace * in the query with the column names.
    $q="INSERT INTO customer (customer_name,customer_email,password,added,referer,source,email_notification) 
               VALUES ('$name','$email','$password','$added','$referer','$source',1 )";
    $query = $config->query($q);
    //echo $q;

    if($query){
        $q_customer = $config->query("SELECT * FROM customer WHERE customer_id=".$config->insert_id);
        $r_customer = $q_customer->fetch_assoc();
        echo json_encode($r_customer);
    }else{
        echo -1;
    }

    //Close the database connection
    $config->close();
?>