<?php
    header("Access-Control-Allow-Origin: *");

    //Create Database connection
    $hostname_config = "127.0.0.1";
    $database_config = "klikeat";
    $username_config = "root";
    $password_config = "";
    $config = new mysqli($hostname_config,$username_config,$password_config,$database_config);
    
    $response = array();
    $items = array();

    $response = json_decode(file_get_contents('php://input'), true);
    $items = $response['items'];
    $cust_id = $response['customer_id'];
    $rest_id = $response['outlet_id'];
    $add_id = $response['address_id'];
    $datetime = $response['datetime'];
    $payment_method = $response['payment_method'];
    $bank_id = '';
    $order_amount = $response['subtotal'];
    $total_discount = '';
    $tax_service_charge = $response['tax_service_charge'];
    $discount_points = $response['discount_points'];
    $delivery_fee = $response['delivery_fee'];
    $tax = '';
    $grandtotal = $order_amount + $tax_service_charge + $delivery_fee;
    $delivery_note = $response['deliveryInstruction'];
    $added = '';
    $modified = '';
    $order_type = $response['order_type'];
    if($order_type == 1)
        $order_status = 0;
    else if ($order_type == 2)
        $order_status = 2;

    //echo json_encode($response);
    
    //Replace * in the query with the column names.
    $q="INSERT INTO `order` (customer_id, restaurant_id, address_delivery_id, datetime, payment_method, 
                                        bank_id, order_amount, total_discount, tax_service_charge, discount_points, 
                                        delivery_fee, tax, grandtotal, delivery_note ,added, modified, order_type,order_status,source)
                         VALUES ('$cust_id', '$rest_id','$add_id', '$datetime', '$payment_method', '$bank_id', '$order_amount', '$total_discount', '$tax_service_charge', '$discount_points','$delivery_fee','$tax', '$grandtotal','$delivery_note','$added','$modified','$order_type','$order_status','app')";
    $query = $config->query($q);
    $order_id = $config->insert_id;

    if($order_id){
        foreach($items as $id=>$prod) {
            $menu_id = $prod['menu_id'];
            $size_id = $prod['size_id']['size_id'];
            $quantity = $prod['qty'];
            $special_instruction = $prod['instructions'];
            if($prod['menu_price']){
                $price = $prod['menu_price'];
            } else {
                $price = $prod['size_id']['size_price'];
            }            
            $q2 = "INSERT INTO `order_detail` 
                            (order_id, menu_id, size_id, quantity,special_instruction,price)
                             VALUES ('$order_id','$menu_id','$size_id','$quantity','$special_instruction','$price')";
            $query = $config->query($q2);

            if(!empty($prod['attribute'])){
                /*$items = array_filter(explode(',',$prod['attr']));
                foreach (array_unique($items) as $item_at){
                        $attr_menu = menuAttributes($config,$prod['menu_id'],$item_at);
                        $price_attr = $prod['qty'] * $attr_menu['charge'];
                        saveOrder_attribute($config,$saveorderdetail,$item_at,$price_attr);*/
            }
        }

        $q4 = $config->query("INSERT INTO `order_handler` (order_id) values ('$order_id')");
    }

    echo $order_id;

    //Close the database connection
    $config->close();
?>