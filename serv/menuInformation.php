<?php
    //Create Database connection
    $db = mysql_connect("127.0.0.1","root","");
    if (!$db) {
        die('Could not connect to db: ' . mysql_error());
    }

    //Select the Database
    mysql_select_db("klikeat",$db);
    
    //Replace * in the query with the column names.
    $result = mysql_query("SELECT * FROM menu WHERE menu_id = ".$_GET['menu_id'], $db);

    $json_response = array();
    
    while ($row = mysql_fetch_assoc($result)) {
        $description = str_replace("<p>", "", $row['menu_description']);
        $description = str_replace("</p>", "", $description);
        $response = array(
                "menu_id" => $row['menu_id'], 
                "menu_name" => $row['menu_name'], 
                "menu_description" => $description, 
                "menu_price" => $row['menu_price'],
                "menu_image" => $row['menu_image'],
                "size" => array(),
                "attribute" => array()
        );

        $result2 = mysql_query("SELECT * FROM `size_menu` a INNER JOIN `size` b
            WHERE b.size_id = a.size_id AND a.menu_id = ".$_GET['menu_id'], $db);

        while ($row2 = mysql_fetch_assoc($result2)) {
            $response2 = array(
                "size_id" => $row2['size_id'],
                "size_name" => $row2['size_name'],
                "size_price" => $row2['size_price']
            );

            array_push($response["size"], $response2);
        }

        $result3 = mysql_query("SELECT * FROM `attributes_menu` a INNER JOIN `attributes` b
            WHERE b.attribute_id = a.attribute_id AND `menu_id` = ".$_GET['menu_id'], $db);

        while ($row3 = mysql_fetch_assoc($result3)) {
            $response3 = array(
                "attribute_id" => $row3['attribute_id'],
                "attribute_name" => $row3['attribute_name'],
                "attribute_price" => $row3['charge']
            );

            array_push($response["attribute"], $response3);
        }

        array_push($json_response, $response);
    }
    

    echo $_GET['callback'].'({ "menu" : '.json_encode($response).' })';
    
    //Close the database connection
    fclose($db);

?>