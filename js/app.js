var url = "http://localhost/angular.klikeat/serv/";
var app = angular.module('indexApp', [
  "sdfilters",
  "cart",
  "search",
  "ionic",
  "customer",
  "ui.bootstrap.datetimepicker",
  "ionic.rating"
]);

app.config(['$httpProvider', function($httpProvider) {
          $httpProvider.defaults.useXDomain = true;

          /**
           * Just setting useXDomain to true is not enough. AJAX request are also
           * send with the X-Requested-With header, which indicate them as being
           * AJAX. Removing the header is necessary, so the server is not
           * rejecting the incoming request.
           **/
          delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
]);

app.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {	
					url : '/login',
					templateUrl : 'login.html',
					controller : 'loginCtrl'
	}).state('midlogin', {	url : '/login-mid/:outlet_id',
							templateUrl : 'login.html',
							controller : 'midLoginCtrl'
	}).state('home', { 	url : '/',
						cache : false,
						templateUrl : 'home.html',
						controller : 'homeCtrl'
	}).state('restaurant-list', { 
						url : '/restaurant-list',
						templateUrl : 'search.html',
						controller : 'restoListCtrl'
	}).state('restaurant', { 
						url : '/restaurant/:restaurant_id',
						templateUrl : 'restaurant.html',
						controller : 'restoCtrl'
	}).state('cart', { 
						url : '/cart/:outlet_id',
						templateUrl : 'cart.html',
						controller : 'cartCtrl'
	}).state('checkout', { 
						url : '/checkout/:outlet_id',
						templateUrl : 'checkout.html',
						controller : 'checkoutCtrl'
	}).state('confirmation', { 
						url : '/confirmation/:order_id',
						templateUrl : 'confirmation.html',
						controller : 'confirmationCtrl'
	}).state('feedback',{
						url : '/feedback/',
						templateUrl : 'feedback.html',
						controller : 'feedbackCtrl',
						cache : false
	}).state('my-account', { 	
						url : '/my-account',
						templateUrl : 'account.html',
						controller : 'accountCtrl'
	}).state('my-address', { 	
						url : '/my-address',
						templateUrl : 'address.html',
						controller : 'addressCtrl'
	}).state('new-address', { 	
						url : '/new-address',
						templateUrl : 'address-new.html',
						controller : 'newAddressCtrl'
	}).state('history',{
						url : '/history/:id',
						templateUrl : 'history.html',
						controller : 'historyCtrl'
	}).state('pages', { 
						url : '/pages/:page',
						templateUrl : 'faq.html'
	}).state('how-to-order',{
						url : '/how-to-order',
						templateUrl : 'howtoorder.html'
	}).state('faq', { 
						url : '/faq/',
						templateUrl : 'faq.html'
	}).state('faq2',{
						url : '/faq2/:page',
						templateUrl : 'faq2.html',
						controller : 'faqCtrl'
	});
}]);

app.config(function($urlRouterProvider,$ionicConfigProvider){ 
    $urlRouterProvider.when('', '/');
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.backButton.text('');
});

app.run(function($rootScope,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopover,$location,Customer,$ionicPlatform){
	$ionicPlatform.ready(function() {
		var logged = Customer.isLogged();
		if(logged == true) {
			Customer.refreshAddress();
		}
	});

	$rootScope.toHome = function() {
		$location.path('/');
	};

	$rootScope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$rootScope.goBack = function() {
		$ionicNavBarDelegate.back();
	};

	$ionicPopover.fromTemplateUrl('popover-account.html', {
		scope: $rootScope,
	}).then(function(popover) {
	    $rootScope.popover = popover;
	});
	  

	$rootScope.openPopover = function($event) {
    	$rootScope.popover.show($event);
	};
	$rootScope.closePopover = function() {
	    $rootScope.popover.hide();
	};
	$rootScope.$on('$destroy', function() {
	    $rootSscope.popover.remove();
	});
	$rootScope.logout = function() {
		Customer.logout();
		$rootScope.popover.hide();
	};
});

app.controller('panelCtrl',function($scope,$location,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.$on('state.login', function () {
    	$scope.logged_in = true;
    });
});

app.controller('addressCtrl',function($scope,$http,$location,Customer,$ionicSideMenuDelegate){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$scope.newAddress = true;
    });
	$scope.addresses = Customer.getAddress();
});

app.controller('historyCtrl',function($scope,$http,$state,$stateParams,$ionicSideMenuDelegate,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
	    	$scope.logged_in = false;
	    	$scope.newAddress = true;
	});
	if($scope.logged_in == true)
	{
		$scope.order_id = $stateParams.id;
		$scope.customer_id = Customer.getCustomerID();
		$scope.orderhistory = {};
		$scope.details = {};
		if($scope.order_id == '') {
			var urlLogin = url + "/orderHistory.php?customer_id="+$scope.customer_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.orderhistory = data.history;
			});
		} else {
			var urlLogin = url + "/orderHistoryDetail.php?customer_id="+$scope.customer_id+"&order_id="+$scope.order_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.details = data.history_detail;
				console.log(data.history_detail);
			});
		}
	} else {
		$state.go('home');
	}

	$scope.toDetail = function(order_id){
		$state.go('history', { 'id' : order_id });
	};
});

app.controller('accountCtrl',function($scope,$http,Customer,$state){
	$scope.customer = Customer.getCustomer();

});

app.controller('loginCtrl',function($scope,$http,Customer,Search,$state){
	$scope.errorLogin = 0;
	$scope.logged_in = Customer.isLogged();
	if($scope.logged_in == true) {
		$state.go('home');
	}
	$scope.doLogin = function (user) {
			var urlLogin = url + "/login.php?email="+user.email+"&password="+user.password+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				if(data.login == 0) {
					$scope.errorLogin = 1;
				} 
				else {
					var address = data.address;
					var login = data.login[0];
					delete data.login;
					delete data.address;

					Customer.login(login,address);
					$scope.errorLogin = 0;
					$state.go('home');
				}
			});
    };
    $scope.doSignUp = function (user) {
    	$http.defaults.useXDomain = true;
		$http({
		    url: url + "/signup.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: user
		})
		.then(function(response) {
			console.log(response.data);
			if(response.data.customer_id > 0) {
				Customer.init(response.data);
		    	$state.go('home');
			} 
		});
    };
});

app.controller('midLoginCtrl',function($scope,$stateParams,$http,$location,Customer,Search){
	$scope.outlet_id = $stateParams.outlet_id;
	if($scope.logged_in == true) {
		$location.path('/cart/'+$scope.outlet_id);
	}
	$scope.doLogin = function (user) {
			var urlLogin = url + "/login.php?email="+user.email+"&password="+user.password+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				if(data.login == 0) {
					$scope.errorLogin = 1;
				} 
				else {
					var address = data.address[0];
					var login = data.login[0];
					delete data.login;
					delete data.address;

					Customer.init(login);
					Customer.setAddress(address);
					$scope.errorLogin = 0;
					$location.path('/checkout/'+$scope.outlet_id);
				}
			});
    };
    $scope.doSignUp = function (user) {
		console.log(user);
    };
});

app.controller('homeCtrl',function($scope,$location,$ionicSideMenuDelegate,$ionicLoading,$http,$ionicModal,Customer,Search,$window){

	$scope.newAddress = true;
	$scope.logged_in = Customer.isLogged();
	$scope.data  = {};
	$scope.locationInfos = [];
	$scope.regionList = [];
	$scope.locationList = {};
	$scope.chooseOption = "Choose a Region first";

	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$scope.newAddress = true;
    });
	if($scope.logged_in == true){
		$scope.customer = Customer.getCustomer();
		$scope.defaultAddress = Customer.getDefaultAddress();
		$scope.addresses = Customer.getAddress();
		$scope.newAddress = false;
		$scope.data.selected = $scope.defaultAddress.address_id;
		Search.init();
	}

	var urlRegion = url + "region.php?callback=JSON_CALLBACK";
	$http.jsonp(urlRegion).success(function(data) {
		$scope.regionInfos = data.region;
    });

    $scope.toRestaurantList = function(){
    	$location.path('/restaurant-list');
    	Search.addLocation($scope.data.locationList);
    }
    $scope.searchLocation = function(id) {
		var urlLocation = url + "location.php?id="+id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLocation).success(function(data) {
			$scope.locationInfos = data.location;
			$scope.chooseOption = "Now Select a Location";
	    });
	};
});

app.controller('restoListCtrl',function($scope,$http,$ionicLoading,Search,$location,Customer) {
	$scope.data  = {};
  	$scope.max = 6;
	$scope.restoCounts = null;
	$scope.restoInfos = null;

	var urlRestaurant = url + "restaurantCount.php?location_id=" + Search.getAll().replace("[","").replace("]","").replace(/\"/g,"")+ "&callback=JSON_CALLBACK";
	$http.jsonp(urlRestaurant).success(function(data){
		$scope.restoCounts = data.restaurant_count;
	});

	var urlRestoInfo = url + "restaurantList.php?location_id=" + Search.getAll().replace("[","").replace("]","").replace(/\"/g,"")+ "&callback=JSON_CALLBACK";
	$http.jsonp(urlRestoInfo).success(function(data){
		$scope.restoInfos = data.restaurant_list;
	});

});

app.controller('restoCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading,$location,Customer){
	$scope.restaurant_id = $stateParams.restaurant_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.logged_in = Customer.isLogged();
	$scope.data = {};
	$scope.menu = {};
	$scope.tab = 0;
	$scope.restoInfos = {};
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });

	$ionicModal.fromTemplateUrl('myModalContent.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

    $scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

	var urlLogin = url + "/restaurant.php?restaurant_id="+$scope.restaurant_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin).success(function(data) {
		$scope.restoInfos = data.restaurant;
		urlLogin = url + "/restaurantDeliveryArea.php?restaurant_id="+$scope.restaurant_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
			$scope.deliveryArea = data.restaurant_delivery;
		});
    });

	var urlLogin = url + "/menu.php?restaurant_id="+$scope.restaurant_id+"&callback=JSON_CALLBACK";
    $http.jsonp(urlLogin).success(function(data) {
		$scope.restoMenus = data.menu;
    });
	  
	$scope.OpenUp = function(a) {
		$scope.tab = a;
	}

	$scope.openModal = function (data){
		$scope.menu_id = data;
		var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
			$scope.menu = data.menu;
			$scope.menu.qty = 1;
			if(data.menu.size.length>0) {
				$scope.menu.size_id = $scope.menu.size[0];
			}
			$scope.modal.show();
		});
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};

  	$scope.addToCart = function (inputs) {
		delete inputs['size'];
		delete inputs['menu_description'];
		var temp = [];
		angular.forEach(inputs.attr,function(value,key){
			if(value.selected == true) {
				temp.push(value);
			}
		});
		if(temp.length == 0)
			delete inputs['attr'];
		else
			inputs.attr = temp;
		Cart.addItem(inputs);
	    $scope.modal.hide();
	    $scope.items = Cart.getTotalItems();
		$scope.prices = Cart.getTotalPrice();
	};

  	$scope.$watch('menu',function(){
	    var price_ea = $scope.menu.menu_price;
	    if(typeof $scope.menu.size_id != "undefined")
			price_ea = $scope.menu.size_id.size_price;
	    var price_attr = 0;
	    angular.forEach($scope.menu.attribute,function(value,key){
			if(value.selected == true) {
			    price_attr += parseFloat(value.attribute_price);
			}
	    });
	    $scope.total = $scope.menu.qty * (parseFloat(price_ea) + parseFloat(price_attr));
	},true);

	Cart.init($scope.restaurant_id);
  	$scope.items = Cart.getTotalItems();
  	$scope.prices = Cart.getTotalPrice();
	
	$scope.goToCart = function() {
		$location.path("/cart/"+$scope.restaurant_id);
	};
}).directive('cartcontents',function() {
	return {
		restrict : 'E',
		templateUrl: 'cartcontents-template.html'
	};
});

app.controller('accountCtrl',function($scope,$http,Customer,$state){
	$scope.customer = Customer.getCustomer();

});

app.controller('addressCtrl',function($scope,$http,$location,Customer,$ionicSideMenuDelegate){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$scope.newAddress = true;
    });
	$scope.addresses = Customer.getAddress();
});

app.controller('historyCtrl',function($scope,$http,$state,$stateParams,$ionicSideMenuDelegate,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
	    	$scope.logged_in = false;
	    	$scope.newAddress = true;
	});
	if($scope.logged_in == true)
	{
		$scope.order_id = $stateParams.id;
		$scope.customer_id = Customer.getCustomerID();
		$scope.orderhistory = {};
		$scope.details = {};
		if($scope.order_id == '') {
			var urlLogin = url + "/orderHistory.php?customer_id="+$scope.customer_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.orderhistory = data.history;
			});
		} else {
			var urlLogin = url + "/orderHistoryDetail.php?customer_id="+$scope.customer_id+"&order_id="+$scope.order_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.details = data.history_detail;
				console.log(data.history_detail);
			});
		}
	} else {
		$state.go('home');
	}

	$scope.toDetail = function(order_id){
		$state.go('history', { 'id' : order_id });
	};
});

app.controller('newAddressCtrl',function($scope,$http,$ionicLoading,$ionicModal,$location,Customer) {
	$scope.newAddress = [
		{ index : 1, text : "Address Detail",checked : false},
		{ index : 2, text : "Extra Guidance or Instructions", checked : false}
	];
	$scope.tab = {};
	$scope.addressInput = { 'address_selection' : 1 };

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};


	$ionicModal.fromTemplateUrl('newaddress-template.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});
	
	$scope.openModal = function (tab){	
		$scope.tab = tab;
		$scope.modal.show();
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};
	$scope.saveAddress = function(address) {
		if(address.patokan)
			$scope.newAddress[0].checked = true;
		if(address.address_content) 
			$scope.newAddress[1].checked = true;
    	$scope.modal.hide();
  	};
  	$scope.commitAddress = function() {
  		$scope.addressInput.customer_id = Customer.getCustomerID();
  		console.log($scope.addressInput);
  		$http({
		    url: url + "/saveAddress.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: $scope.addressInput
		})
		.then(function(response) {
			if(response.data > 0) {
				$location.path('/my-address');
			}
		});
  		//$location.path('/my-address');
  	}
});

app.controller('cartCtrl',function($scope,$http,$stateParams,$ionicModal,$ionicLoading,Cart,Customer,$location,$ionicPopup) {
	$scope.outlet_id = $stateParams.outlet_id;
	//$scope.brand_id = $stateParams.brand_id;
	Cart.init($scope.outlet_id);
	$scope.delivery_fee = 18000;
	$scope.data = {};
	$scope.data.datetimetype = 1;
	$scope.data.datetime = new Date();
    var momentz = moment($scope.data.datetime);
    Cart.updateTime($scope.data.datetimetype,momentz.unix());
	$scope.min_hit = false;

	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
	
	$scope.items = Cart.getAll();
	var totalItems = Cart.getTotalItems();
	if(totalItems == 0)
		$location.path("/order/"+$scope.outlet_id+"/");
	
	var totalPrice = 0;
	angular.forEach($scope.items,function(value,key){
		var price_ea = parseInt(value.menu_price);
		if(value.size_id) {
			price_ea = parseInt(value.size_id.size_price);
		}
		totalPrice += parseInt(value.qty) * price_ea;
		if(value.attr) {
			angular.forEach(value.attr,function(value1,key1) {
				totalPrice += parseInt(value1.attribute_price) * parseInt(value.qty);
			});
		}
	});

	$scope.totalPrice = totalPrice;
	$scope.totalItems = totalItems;

	var urlz = url + "/getCart.php?restaurant_id="+$scope.outlet_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlz).success(function(data){
		$scope.tax_service_charge = data.cart[0].service_charge;
		$scope.min_transaction = data.cart[0].limit_transaction;
		if(data.cart[0].delivery_type == 0){
			$scope.delivery_fee = 18000;
		} else {
			if($scope.totalPrice>$scope.min_transaction){
				$scope.delivery_fee = data.cart[0].delivery_charge2;
			}else{
				$scope.delivery_fee = data.cart[0].delivery_charge;
			}
		}
		Cart.updatePrice($scope.tax_service_charge,$scope.delivery_fee);
		$scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + parseFloat($scope.delivery_fee);
		if($scope.totalPrice > $scope.min_transaction)
			$scope.min_hit = true;
	});


	$scope.editItem = function(index) {

	};

	$scope.deleteItem = function(index) {
		Cart.removeItem(index);
		$scope.items = Cart.getAll();
		var totalItems = Cart.getTotalItems();
		$scope.totalPrice = Cart.getTotalPrice();
		$scope.totalItems = totalItems;
		if(totalItems == 0)
			$location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id+"/");
		$scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
		if($scope.totalPrice > $scope.min_transaction)
			$scope.min_hit = true;
		else
			$scope.min_hit = false;
	};

	$ionicModal.fromTemplateUrl('datetime-template.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});
	
	$scope.openModal = function (){
		$scope.modal.show();
  	};
  	$scope.closeModal = function() {
		$scope.data.datetimetype = 1;
		$scope.data.datetime = new Date();
    	$scope.modal.hide();
    	var momentz = moment($scope.data.datetime);
    	Cart.updateTime($scope.data.datetimetype,momentz.unix());
  	};
	$scope.saveModal = function() {
		$scope.data.datetimetype = 2;
    	$scope.modal.hide();
    	var momentz = moment($scope.data.datetime);
    	Cart.updateTime($scope.data.datetimetype,momentz.unix());
  	};
  	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Mininum Order',
	     template: 'Minimum Order untuk Delivery tidak Tercapai'
	   });
	};
  	$scope.toCheckout = function() {
  		if(Customer.isLogged()) {
  			$location.path('/checkout/'+$scope.outlet_id);
  		}
  		else {
  			$location.path('/login-mid/'+$scope.outlet_id);
  		}
  	};
});

app.controller('checkoutCtrl',function($scope,$http,$stateParams,$ionicPopup,$ionicLoading,Cart,Search,$location,Customer) {
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.logged_in = Customer.isLogged();
	$scope.addressInput = {};
	$scope.addr = {};
	$scope.addrs = {};
	$scope.myAddr = {};
	$scope.data = {};
	$scope.addressList = {};
	$scope.searchType=1;
	$scope.deliveryInstruction = {};
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
    });
    if($scope.logged_in == false) {
    	$location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
    }
	Cart.init($scope.outlet_id);
	$scope.items = Cart.getAll();
	$scope.totalPrice = parseInt(Cart.getTotalPrice());
	$scope.totalItems = Cart.getTotalItems();
	$scope.tax_service_charge = Cart.getTaxCharge()/100 * $scope.totalPrice;
	$scope.delivery_fee = parseInt(Cart.getDeliveryFee());
	//$scope.searchType = Search.getType();
	//if($scope.searchType > 0) {
		$scope.customer_detail = Customer.getCustomer();
		var urlx = url + "getAddresDetail.php?customer_id="+$scope.customer_detail.customer_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlx).success(function(data) {
			$scope.addrs = data.address_list;
		});
	/*}
	else {
		$scope.addressInput.address_selection = 1;
	}*/

	$scope.saveAddress = function(address) {
		$scope.addressInput.latitude = Search.getLat();
		$scope.addressInput.longitude = Search.getLng();
		$scope.addressInput.customer_id = Customer.getCustomerID();

		$http({
		    url: url + "/saveAddress.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: $scope.addressInput
		})
		.then(function(response) {
			if(response.data.address_id > 0) {
				Customer.setAddress(response.data.address);
				Search.setType(response.data.address_id);
				$scope.searchType = response.data.address_id;
				$scope.addr = Customer.getAddressById($scope.searchType);
			}
		});
	};

	$scope.myHome = function(){
		$scope.myAddress = JSON.parse(localStorage.getItem("customer_address"));
		$scope.myAddr = $scope.myAddress.address_list;
		if($scope.myAddress == null) {
			return "";
		} else {
		for(var i = 0; i < $scope.myAddr.length;i++){
			if($scope.myAddr[i].address_id == $scope.data.addressList) {
				$scope.addr = $scope.myAddr[i];
				break;
			}
		}
		}
	}

	$scope.placeOrder = function(){
		var test ={};
		test.items = Cart.getAll();
		test.customer_id = Customer.getCustomerID();
		test.address_id = $scope.data.addressList;
		test.outlet_id = $scope.outlet_id;
		test.tax_service_charge = $scope.tax_service_charge;
		test.delivery_fee = $scope.delivery_fee;
		test.deliveryInstruction = $scope.deliveryInstruction.data;
		test.payment_method = "cash";
		test.subtotal = Cart.getTotalPrice();
		test.order_type = Cart.getDeliveryType();
		test.order_datetime = Cart.getDeliveryTime();
		//console.log(test);
		
		$http({
		    url: url + "/placeOrder.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: test
		})
		.then(function(response) {
			var order_id = response.data;
			console.log(response.data);
			if(order_id > 0) {
				$location.path('/confirmation/'+order_id);
			} else {

			}
		});
		
	};
});

app.controller('confirmationCtrl',function($scope,$http,$ionicLoading,$location,$stateParams,Customer,Cart) {
	$scope.order_id = $stateParams.order_id;
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.customer_email = Customer.getCustomerEmail();
    Cart.clearCart();
});

app.controller('faqCtrl',function($scope,$location,$stateParams,$ionicNavBarDelegate){
	$scope.section = $stateParams.page;
	$scope.gozBack = function() {
		$location.path('#/faq/');
	};
});

app.controller('feedbackCtrl',function($scope,$location,$stateParams,Customer,$http){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.$on('state.login', function () {
    	$scope.logged_in = true;
    });
	if($scope.logged_in == true)
	{
		$scope.customer = Customer.getCustomer();
		$scope.support = {};
		$scope.success_login = false;
		$scope.support.name = $scope.customer.customer_name;
		$scope.support.email = $scope.customer.customer_email;
		$scope.support.type = "support";

		$scope.submitSupport = function(form) {
			$http.defaults.useXDomain = true;
			$http({
			    url: url + "/feedback.php",
			    method: "POST",
			    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
			    data: $scope.support
			})
			.then(function(response) {
				console.log(response.data);

			});

			form.$setPristine();
	      	form.$setUntouched();
			$scope.success_login = true;
			$scope.support.message = "";
		};
	} 
});