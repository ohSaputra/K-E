<?php
    $hostname_config = "127.0.0.1";
    $database_config = "klikeat";
    $username_config = "root";
    $password_config = "";
    $config = new mysqli($hostname_config,$username_config,$password_config,$database_config);

    $query = $config->query("SELECT o.order_id,o.order_status,o.datetime, o.grandtotal, o.payment_method, r.restaurant_name, h.rider_paid
					FROM `order` as o, restaurant r,order_handler h WHERE o.restaurant_id=r.restaurant_id AND h.order_id = o.order_id 
					AND customer_id = ".$_GET['customer_id']." ORDER BY datetime DESC");
	while($r_query = $query->fetch_assoc()){
		$result[] = $r_query;
	}
	echo $_GET['callback'].'({ "history" : '.json_encode($result).' })';

	$query->close();
?>