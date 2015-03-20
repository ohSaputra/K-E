<?php
    //Create Database connection
    $hostname_config = "127.0.0.1";
    $database_config = "klikeat";
    $username_config = "root";
    $password_config = "";
    $config = new mysqli($hostname_config,$username_config,$password_config,$database_config);
    
    //Replace * in the query with the column names.
    $query = $config->query("SELECT DISTINCT(r.restaurant_id),restaurant_name,logo_image2,top_menu_image,food_permit,url,
                                delivery_hours_start,delivery_hours_end FROM restaurant r, restaurant_delivery d 
                                WHERE restaurant_status = 1 AND r.restaurant_id = d.restaurant_id AND d.location_id 
                                IN (".$_GET['location_id'].",1) order by new desc,restaurant_type DESC,restaurant_name");
    $json_response = array();

    if($query){
        while ($row = $query->fetch_assoc()) {
        $names = explode("@", $row['restaurant_name']);
        $start = explode(":", $row['delivery_hours_start']);
        $end = explode(":", $row['delivery_hours_end']);
        $time = $start[0].':'.$start[1].' - '.$end[0].':'.$end[1];
        $response = array(
                "restaurant_id" => $row['restaurant_id'],
                "restaurant_firstname" => $names[0],
                "restaurant_lastname" => $names[1],
                "url" => $row['url'],
                "top_menu_image" => $row['top_menu_image'],
                "foodtype_name" => array(),
                "rating" => array(),
                "time" => $time
        );

        $q_foodtype = $config->query("SELECT f.foodtype_name FROM food_type f
                    JOIN food_type_restaurant j ON f.foodtype_id = j.foodtype_id
                    JOIN restaurant r ON j.restaurant_id = r.restaurant_id WHERE
                    r.restaurant_id = ".$row['restaurant_id']." ORDER BY f.foodtype_id ASC LIMIT 7");
        while($r_foodtype = $q_foodtype->fetch_assoc()){
            array_push($response['foodtype_name'],$r_foodtype['foodtype_name']);
        }

        $q_rating =  $config->query("SELECT AVG(rate) as avg_rate FROM rating_review 
                                    WHERE review_status=1 AND restaurant_id = ".$row['restaurant_id']);
        $r_rating =  $q_rating->fetch_assoc();
        array_push($response['rating'],$r_rating['avg_rate']);

        array_push($json_response, $response);
        }
    }    

    echo $_GET['callback'].'({ "restaurant_list" : '.json_encode($json_response).' })';
    
    //Close the database connection
    $query->close();

?>