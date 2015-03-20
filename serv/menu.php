<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT DISTINCT a.menucategory_id, b.category_name FROM menu a INNER JOIN menu_category b 
        WHERE a.restaurant_id = ".$_GET['restaurant_id']." AND b.menucategory_id = a.menucategory_id AND a.menu_status = 1", $db);


    $json_response = array();
   
    
    while ($row = mysql_fetch_assoc($result)) {

        $response = array(
                "menucategory_id" => $row['menucategory_id'],
                "category_name" => $row['category_name'],
                "menu_image" => $row['menu_image'],
                "menu_list" => array(),
                "size" => array()
        );
        
        $result2 = mysql_query("SELECT `menu_id`, `menu_name`, `menu_price` FROM `menu`
            WHERE `restaurant_id` = ".$_GET['restaurant_id']." AND `menu_status` = 1 AND `menucategory_id` = ".$row['menucategory_id'], $db);

        while ($row2 = mysql_fetch_assoc($result2)) {
            $response2 = array(
                "menu_id" => $row2['menu_id'],
                "menu_name" => $row2['menu_name'],
                "menu_price" => $row2['menu_price']
            );

            if(empty($row2['menu_price'])){

                $result3 = mysql_query("SELECT * FROM `size_menu` a INNER JOIN `size` b
                    WHERE b.size_id = a.size_id AND a.menu_id = ".$row2['menu_id'], $db);

                $row3 = mysql_fetch_assoc($result3);
                $response2['menu_price'] = $row3['size_price'];
            }

            array_push($response["menu_list"], $response2);
        }
        
        array_push($json_response, $response);
    }
    
    echo $_GET['callback'].'({ "menu" : '.json_encode($json_response).' })';
    
    //Close the database connection
    fclose($db);

?>