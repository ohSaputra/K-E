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
    $customer_id = $response['customer_id'];
    $address_type = $response['address_selection'];
    $tower_division = $response['tower_division'];
    $floor = $response['floor'];
    $room_unit = $response['room_unit'];
    $address_content = $response['address_content'];
    $address_note = $response['patokan'];
    $address_name = $response['address_name'];

    if ($address_type == 1) {
        $tag = 'Kantor';
    } else if ($address_type == 2) {
        $tag = 'Rumah';
    } else if ($address_type == 3) {
        $tag = 'Apartment';
    } else if ($address_type == 4) {
        $tag = 'Hotel';
    } else if ($address_type == 5) {
        $tag = 'Ruko';
    } else if ($address_type == 6) {
        $tag = 'Kost';
    }
    
    //Replace * in the query with the column names.
    $q="INSERT INTO address (customer_id,address_type,address_name,tower_division,floor,room_unit,address_content,address_note,
                            tag) 
        VALUES ('$customer_id','$address_type','$address_name','$tower_division','$floor','$room_unit', '$address_content', '$address_note', '$tag')";
    $query = $config->query($q);

    echo $config->insert_id;

    //Close the database connection
    $config->close();
?>