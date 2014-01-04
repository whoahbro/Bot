var global_moreYmalWidth = 600;
var miniAddToCart = function() {
	function attachMiniCartYMAL() {
		//$("#miniAddToCart_ymal").html('<p>Other shoppers also like these items:</p><table><tr></tr></table>');

		if(typeof(useMyBuyYMALS) != "undefined" && !MyBuysDisabledForHL) {
			if(useMyBuyYMALS) {   // if mybuys enabled
				$("#miniAddToCart_ymal").append("<iframe src='" + miniCartYmalsTemplate + "?secure=" + (location.protocol === 'https:') + "' id='miniCartYmals' scrolling='auto' marginwidth='0' marginheight='0' frameborder=0' style='border: medium none; overflow: hidden; width: 360px; height:301px' ></iframe>");
				//$("#miniAddToCart_ymal").append("<div id='more_ymal_minicartContainer'><img id='more_ymal_minicart' src='" + moreYmalsImage + "' /></div>");
				//$("#more_ymal_minicart").click(miniAddToCart.openAdditionalYMALs);
			} else {
				$("#miniAddToCart_ymal").append("<div id='legacyMiniCartYmalContainer'></div>");
				$("#legacyMiniCartYmalContainer").load(miniCartLegacyYMALTemplate +  "?secure=" + (location.protocol === 'https:') + "&sku=" + escape($("#minicart_addedSku").text()));

				
			}
		}
	}
	
	return {
		/*autoResizeYmals: function() {
			//alert( $("#miniCartYmals").contents().find("#mybuyspagezone1 table").height());
			winHeight = $("#miniCartYmals").contents().find("#mybuyspagezone1 table").height();
			$("#miniCartYmals").height(winHeight + 35);
			//		e.height = e.contentWindow.document.body.scrollHeight;

		
		,}*/
		openMiniAddToCart: function(formID, callback, secure) {
			miniAddToCart.closeMiniAddToCart();
			var IlatcField = '<input type="Hidden" name="inlineAddToCart" value="1">';
			$('#' + formID).append(IlatcField);
			var formData = $('#' + formID).serialize();
			
			
			appendURL = $("#rawURL").text().split("?",2)[1];
			if( typeof(appendURL) == "undefined") {
				appendURL = "";
			}
			
			if( typeof(orderSummaryTarget) == "undefined") {
				orderSummaryTarget = "#order_summary_content";
			}
			
			var current_order_summary = $(orderSummaryTarget).html();
			$(orderSummaryTarget).html("<strong>Adding item...</strong>");
			disableToCartButton();
			$.ajax({
				url: "/catalog/miniAddToCart.cfm?secure=" +  (location.protocol == 'https:' ? 1:0) + "&" + appendURL,
				type: "POST",
				data: formData,
				success: function(data, textStatus) {
					
					$("input[name='inlineAddToCart']").remove();	
					$("#pdpAddToCart_overlayBG").hide();
					$("#pdpAddToCartWrapper").hide();	
				
					revertOrderTotal=false;
					$('body').animate({scrollTop:0},"fast", "linear", function () {
						$("body").prepend('<div id="miniAddToCartWrapper"><div id="miniAddToCartWin"></div></div>');
						scroll(0,0);
						var miniAddToCartTargetObj = null;
						if (typeof(miniAddToCartTarget) == "undefined") {
							miniAddToCartTargetObj = $("#order_summary").parent();
						} else {
							miniAddToCartTargetObj = $(miniAddToCartTarget);
						}
	
						var XOffset = 0;
						if (typeof(miniAddToCartXOffset) != "undefined") {
							XOffset = miniAddToCartXOffset;
						}
						var offset = miniAddToCartTargetObj.offset();
						var target_width = miniAddToCartTargetObj.width();
						var target_height = miniAddToCartTargetObj.height();
						var miniAddToCart_width = $("#miniAddToCartWrapper").width() + 10;
						var left = offset.left + target_width - miniAddToCart_width + XOffset;
						var top = offset.top + target_height;
						$("#miniAddToCartWrapper").css({left: left, top: top});
						$("#miniAddToCartWin").css({top: "-400px"});
						$("#miniAddToCartWin").html(data);
						attachMiniCartYMAL();
						if (revertOrderTotal) {
							$(orderSummaryTarget).html(current_order_summary);
						}
						$("#miniAddToCartWin").animate({top: "-1px"}, 1000);
						$('#miniAddToCart').click(function(e) {
							e.stopPropagation();
						});
						$('#btnRemoveMaskPrice').click(function(e) {
							e.stopPropagation();
						});
						
						if (typeof BORISEnabled != 'undefined' && BORISEnabled) {
							if ($('#pdp_storeNumber').length != 0) {
								$('#pdp_storeNumber').val(0);
								$('#pdp_fulfillmentType').val('SHIP_TO_HOME');
								$('#pdp_storeCostOfGoods').val(0);
							} else if ($('#qv_storeNumber').length != 0) {
								$('#qv_storeNumber').val(0);
								$('#qv_fulfillmentType').val('SHIP_TO_HOME');
								$('#qv_storeCostOfGoods').val(0);
							}
						}
						
						$(document).click(miniAddToCart.closeMiniAddToCart);
		
						if (typeof(callback) != "undefined")
							callback();
						//clearTimeout(showProcessingMessageTimer);
						setTimeout("enableToCartButton()", 1010);
					});
				
				},
				error: function(jqXHR, exception) {
				
					$('body').animate({scrollTop:0},"fast", "linear", function () {
						$("body").prepend('<div id="miniAddToCartWrapper"><div id="miniAddToCartWin"></div></div>');
						scroll(0,0);
						var miniAddToCartTargetObj = null;
						if (typeof(miniAddToCartTarget) == "undefined") {
							miniAddToCartTargetObj = $("#order_summary").parent();
						} else {
							miniAddToCartTargetObj = $(miniAddToCartTarget);
						}
						var XOffset = 0;
						if (typeof(miniAddToCartXOffset) != "undefined") {
							XOffset = miniAddToCartXOffset;
						}
						var offset = miniAddToCartTargetObj.offset();
						var target_width = miniAddToCartTargetObj.width();
						var target_height = miniAddToCartTargetObj.height();
						var miniAddToCart_width = $("#miniAddToCartWrapper").width() + 10;
						var left = offset.left + target_width - miniAddToCart_width + XOffset;
						var top = offset.top + target_height;
						$("#miniAddToCartWrapper").css({left: left, top: top});
						$("#miniAddToCartWin").css({top: "-400px"});
	
						$("#miniAddToCartWin").html("<div id='inLineCartAdd'><div id='miniAddToCart_header'>Error encountered attempting to add to cart:<a id='miniAddToCart_close' href='javascript:miniAddToCart.closeMiniAddToCart({cmConversionEvent: 'Close Mini-Cart'})'>Close <span class='x'>X</span></a></div><ul id='miniAddToCart_error'><li><span class='error'>We're sorry, but there was an error attempting to add the item to your cart.</span></li></ul></div>");
						$(orderSummaryTarget).html("<strong>Cart Error...</strong>");
						
						$("#pdpAddToCart_overlayBG").hide();
						$("#pdpAddToCartWrapper").hide();
						$("#miniAddToCartWin").animate({top: "-1px"}, 1000);
									
						$('#miniAddToCart').click(function(e) {
							e.stopPropagation();
						});
						$(document).click(miniAddToCart.closeMiniAddToCart);
						
						if (typeof(callback) != "undefined")
							callback();
							
						//clearTimeout(showProcessingMessageTimer);
						enableToCartButton();
					});
				}
			});
		},
		closeMiniAddToCart: function(data) {
			// coremetrics
			if(typeof(data) != 'undefined' && typeof(data.cmConversionEvent) != 'undefined') {
				if(data.cmConversionEvent != 'Close Mini-Cart' && data.cmConversionEvent != 'Continue Shopping-Top' 
					&& data.cmConversionEvent != 'View Full Cart Button' && data.cmConversionEvent != 'View Full Cart'){
					cmCreateConversionEventTag(data.cmConversionEvent, 1, 'Mini-Cart', 0);
				}
				if (data.cmConversionEvent == 'Checkout' || data.cmConversionEvent == 'View Full Cart') {
					registerConversionEvent('Mini-Cart', data.cmConversionEvent);
				} else {
					cmCreateConversionEventTag(data.cmConversionEvent, 2, 'Mini-Cart', 0);
				}
			}
			
			$("#miniAddToCartWin").animate({top: "-400px"}, function() {
				$("#miniAddToCartWrapper").remove();			
			});
			
			
		},
		openAdditionalYMALs: function() {
			miniAddToCart.closeMiniAddToCart();
			
			$("body").prepend('<div id="moreYmalWindowWrapper"><div id="moreYmalWindow_top"><div id="moreYmalWindow_topRight">Great Product Recommendations Just for You!</div></div><div id="moreYmalWindow_middle"><div id="moreYmalWindow_middleRight"><div id="moreYmalWindowLoading"></div><div id="moreYmalWindowContent"></div><div style="clear: both"></div></div></div><div id="moreYmalWindow_bottom"><div id="moreYmalWindow_bottomRight"><a href="javascript:miniAddToCart.closeAdditionalYmals();"><span class="red">x</span> Close</a></div></div></div>');
			//$("#moreYmalWindowLoading").css("display", "block");	
			//center
			//$(document).click(miniAddToCart.closeAdditionalYmals);
			var bodyWidth = $("body").width();
			var leftOffset = (bodyWidth - global_moreYmalWidth) / 2;
			var topOffset = getViewpointTop() + ((getViewpointHeight() - $("#moreYmalWindow").height()) / 2);		
			$("#moreYmalWindow").css({ left: leftOffset, top: topOffset, width: global_moreYmalWidth });	
			$("#moreYmalWindow").hide();
			$("#moreYmalWindowContent").append("<iframe src='" + moreYmalsTemplate + "?secure=" +  (location.protocol == 'https:' ? 1:0) + "' id='miniCartExtendedYmals' marginwidth='0' marginheight='0' frameborder=0' scrolling='no' style='margin-left:20px; border: medium none; overflow: hidden; height: 400px; width: 580px;'></iframe>");
    	    var winH = $(window).height();  
        	var winW = $(window).width();  
	        $('#moreYmalWindowWrapper').css('top',  Math.max(0,winH/2-$('#moreYmalWindowWrapper').height()/2));  
	        $('#moreYmalWindowWrapper').css('left', Math.max(0,winW/2-$('#moreYmalWindowWrapper').width()/2));  
			$("#moreYmalWindowContent").show();
	
		},
		closeAdditionalYmals: function() {
			$("#moreYmalWindowWrapper").remove();
		},
		removeMaskedItem: function(formID) {	
			
			cmCreateConversionEventTag('Remove From Cart', 2, 'Mini-Cart', 0);
			
			if( typeof(orderSummaryTarget) == "undefined") {
				orderSummaryTarget = "#order_summary_content";
			}
			
			var current_order_summary = $(orderSummaryTarget).html();
			$(orderSummaryTarget).html("<strong>Removing item...</strong>");
			var formData = $('#' + formID).serialize();
			var secure = typeof securedRequest != 'undefined' && securedRequest ? 1 : 0;

			$.ajax({
				url: "/catalog/miniRemoveFromCart.cfm?secure="+secure,
				type: "POST",
				data: formData,
				success: function(data, textStatus) {
					$('body').append(data);
					//alert(data);
					//miniAddToCart.closeMiniAddToCart({cmConversionEvent: 'Remove From Cart'});
				},
				error: function( XMLHttpRequest,textStatus,errorThrown) {
						console.log(XMLHttpRequest);
				}
			});
		}
		
	}
}();

miniCartLogging = function() {

	return {
		//Login status
		 UNREGISTERED: 1
		,REGISTERED_AUTHENTICATED: 2
		,REGISTERED_RECOGNIZED: 3
		,LOYALTY_AUTHENTICATED: 4
		,LOYALTY_RECOGNIZED: 5
			
		//Page Actions	
		,ADD_TO_CART: 1
		
		//Page Errors
		,OUT_OF_STOCK: 1
		,INVENTORY_CHECK: 2
		,QUEUED: 3
		
		,setLoginStatus: function(newStatus) {
			this.loginStatus = newStatus;
		}
		,setPageAction: function(newAction) {
			this.pageAction = newAction;
		}	
		,setPageError: function(newError) {
			this.pageError = newError;
		}	
		// does coremetrics log
		,doCMLog: function() {
			categoryID = "";
			pageName = "";
			switch(this.loginStatus) {
				case this.UNREGISTERED:
					categoryID += "Unreg";
					pageName += "Unreg";
				  break;
				case this.REGISTERED_AUTHENTICATED:
					categoryID += "Reg Auth";
					pageName += "Reg Auth";
				  break;
				case this.REGISTERED_RECOGNIZED:
					categoryID += "Reg Recg";
					pageName += "Reg Recg";
				  break;
				case this.LOYALTY_AUTHENTICATED:
					categoryID += "Loy Auth";
					pageName += "Loy Auth";
				  break;
				case this.LOYALTY_RECOGNIZED:
					categoryID += "Loy Recg";
					pageName += "Loy Recg";
				  break;
			}
			categoryID += " MiniCart";
			pageName += " MiniCart";			
			// errors override
			if(this.pageError != undefined) {
				switch(this.pageError) {
					case this.OUT_OF_STOCK:
						categoryID += " OOS";
						pageName += ": Error: Item Out Of Stock";
						break;
					case this.INVENTORY_CHECK:
						categoryID += " Er Inv API";
						pageName += ": Error: Inventory Check Required";
						break;
					case this.QUEUED:
						categoryID += " Ckout Queue";
						pageName += ": Checkout Queue";
						break;
				}
				
			} else {
				switch(this.pageAction) {
					case this.ADD_TO_CART:
						categoryID += " Add";
						pageName += " View: Add to MiniCart";
						break;
				}
			}
			cmCreatePageviewTag(pageName, categoryID, null, null);
		}
		
	}
}



window.addEventListener('load', 
function() {

    var added = false;
    
    function interval1(){
        return  window.setInterval(function(){
                if(document.getElementById("miniAddToCartWrapper") !=  null){

                    if(document.getElementById("miniAddToCart_error") ==  null){
                        added = true;
                        window.location = "https://www.footlocker.com/checkout/";

                    }

                    else{
			//location.reload();
                        var errorClose = document.getElementById("miniAddToCart_close");
                        errorClose.click();
			
                    }

                }
                else if(added == false || document.getElementById("miniAddToCartError") !=  null){
                    var cartbtn = document.getElementById("addToCartLink");
                    cartbtn.click();
		}
        }, 1000);
    }
    
    var id1 = interval1();
    
    window.setInterval(function(){
        if(added == true){
            window.clearInterval(id1);

        }
    }, 100);
    
}, false);




/*
IntList::IntList() {
    head = 0;
    tail = 0;
}

IntList::IntList(const IntList &copy) {
    head = 0;
    tail = 0;
    for(IntNode* curr = copy.head; curr; curr = curr->next)
    {
        push_back(curr->data);
    }
}

IntList::~IntList() {
    while(head)
    { pop_front(); }
}

//const IntList IntList::operator=(const IntList & rhs) {
    
//}

void IntList::display() const {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        cout << curr->data << " " ;
    }
}

void IntList::push_front(int value) {
    IntNode* temp = new IntNode(value);
    if(head == NULL)
    {
        head = temp;
        tail = temp;
        return;
    }
    temp->next = head;
    head = temp;
}

void IntList::push_back(int value) {
    IntNode* temp = new IntNode(value);
    if(!head)
    {
        head = temp;
        tail = temp;
        return;
    }
    
    tail->next = temp;
    tail = temp;
    
}

void IntList::pop_front() {
    if(!head)
    { return; }
    IntNode* temp = head;
    head = head->next;
    delete temp;
    if(head == 0)
    { tail = 0; }
}

void IntList::select_sort() {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        IntNode* m = curr;
        for(IntNode* temp = curr->next; temp != 0; temp = temp->next)
        {
            if(m->data > temp->data)
            {
                m = temp;
            }
        }
        int dat = curr->data;
        curr->data = m->data;
        m->data = dat;
    }
}

void IntList::insert_sorted(int value) {
    if(value <= head->data)
    {
        push_front(value);
    }
    else if(value >= tail->data)
    {
        push_back(value);
    }
    else
    {
        IntNode* temp = new IntNode(value);
        for(IntNode* curr = head; curr != 0; curr = curr->next)
        {
            if(curr->next->data > temp->data)
            {
                temp->next = curr->next;
                curr->next = temp;
                break;
            }
        }
    }
}

void IntList::remove_duplicates() {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        IntNode* temp = curr;
        for(IntNode* m = curr->next; m != 0; m = m->next)
        {
            if(curr->data == m->data)
            {
                if(m->next == 0)
                {
                    curr->next = 0;
                    delete m;
                }
                else
                {
                    temp->next = m->next;
                    delete m;
                    m = temp;
                }
            }
        }
    }
}

void clear() {
    
}
*/
/*
void IntList::remove(int value) {
    IntNode* curr = head;
    if(curr == head)
    {
        if(curr->data == value)
        {
            curr = curr->next;
            head = curr;
        }
        //else
        //{
         //   curr = curr->next;
        //}
    }
    
    while(curr->next != 0 && curr->next->data != value)
    {
        curr = curr->next; 
    }
    if(curr->next != 0)
    {
    curr->next = curr->next->next;
    }
    
   
    /*while(curr != 0)
    {
        IntNode* temp = curr;
        while(head->next == curr)
        {
            if(curr->data == value)
            {
                head->next = curr->next;
                temp = head;
            }
            curr = curr->next;
        }
        curr = curr->next;
        
        /*
        IntNode* temp = curr->next;
        
        if(temp->data == value)
        {
            curr->next = temp->next;
        }
        curr = curr->next;
        */
    //}
//}
/*
void IntList::reverse() {
    
    if(head == NULL)
    return;

    IntNode *prev = NULL, *current = NULL, *next = NULL;
    current = head;
    
    while(current != NULL){
        next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    head = prev;
    
}

IntNode* IntList::getHead() {
    return head;
}

void IntList::recursive_reverse() {
    IntNode* a = head;
    IntNode* b = tail;
    recursive_reverse(a,b);
}

IntNode* IntList::recursive_reverse(IntNode* rest, IntNode* reversed) {
    
    IntNode *current;

    if (rest == NULL)
        return reversed;

    current = rest;
    rest = rest->next;
    current->next = reversed;

    recursive_reverse(rest, current);
}
*/
/*
IntList::IntList() {
    head = 0;
    tail = 0;
}

IntList::IntList(const IntList &copy) {
    head = 0;
    tail = 0;
    for(IntNode* curr = copy.head; curr; curr = curr->next)
    {
        push_back(curr->data);
    }
}

IntList::~IntList() {
    while(head)
    { pop_front(); }
}

//const IntList IntList::operator=(const IntList & rhs) {
    
//}

void IntList::display() const {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        cout << curr->data << " " ;
    }
}

void IntList::push_front(int value) {
    IntNode* temp = new IntNode(value);
    if(head == NULL)
    {
        head = temp;
        tail = temp;
        return;
    }
    temp->next = head;
    head = temp;
}

void IntList::push_back(int value) {
    IntNode* temp = new IntNode(value);
    if(!head)
    {
        head = temp;
        tail = temp;
        return;
    }
    
    tail->next = temp;
    tail = temp;
    
}

void IntList::pop_front() {
    if(!head)
    { return; }
    IntNode* temp = head;
    head = head->next;
    delete temp;
    if(head == 0)
    { tail = 0; }
}

void IntList::select_sort() {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        IntNode* m = curr;
        for(IntNode* temp = curr->next; temp != 0; temp = temp->next)
        {
            if(m->data > temp->data)
            {
                m = temp;
            }
        }
        int dat = curr->data;
        curr->data = m->data;
        m->data = dat;
    }
}

void IntList::insert_sorted(int value) {
    if(value <= head->data)
    {
        push_front(value);
    }
    else if(value >= tail->data)
    {
        push_back(value);
    }
    else
    {
        IntNode* temp = new IntNode(value);
        for(IntNode* curr = head; curr != 0; curr = curr->next)
        {
            if(curr->next->data > temp->data)
            {
                temp->next = curr->next;
                curr->next = temp;
                break;
            }
        }
    }
}

void IntList::remove_duplicates() {
    for(IntNode* curr = head; curr != 0; curr = curr->next)
    {
        IntNode* temp = curr;
        for(IntNode* m = curr->next; m != 0; m = m->next)
        {
            if(curr->data == m->data)
            {
                if(m->next == 0)
                {
                    curr->next = 0;
                    delete m;
                }
                else
                {
                    temp->next = m->next;
                    delete m;
                    m = temp;
                }
            }
        }
    }
}

void clear() {
    
}
*/
/*
void IntList::remove(int value) {
    IntNode* curr = head;
    if(curr == head)
    {
        if(curr->data == value)
        {
            curr = curr->next;
            head = curr;
        }
        //else
        //{
         //   curr = curr->next;
        //}
    }
    
    while(curr->next != 0 && curr->next->data != value)
    {
        curr = curr->next; 
    }
    if(curr->next != 0)
    {
    curr->next = curr->next->next;
    }
    
   
    /*while(curr != 0)
    {
        IntNode* temp = curr;
        while(head->next == curr)
        {
            if(curr->data == value)
            {
                head->next = curr->next;
                temp = head;
            }
            curr = curr->next;
        }
        curr = curr->next;
        
        /*
        IntNode* temp = curr->next;
        
        if(temp->data == value)
        {
            curr->next = temp->next;
        }
        curr = curr->next;
        */
    //}
//}
/*
void IntList::reverse() {
    
    if(head == NULL)
    return;

    IntNode *prev = NULL, *current = NULL, *next = NULL;
    current = head;
    
    while(current != NULL){
        next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }
    
    head = prev;
    
}

IntNode* IntList::getHead() {
    return head;
}

void IntList::recursive_reverse() {
    IntNode* a = head;
    IntNode* b = tail;
    recursive_reverse(a,b);
}

IntNode* IntList::recursive_reverse(IntNode* rest, IntNode* reversed) {
    
    IntNode *current;

    if (rest == NULL)
        return reversed;

    current = rest;
    rest = rest->next;
    current->next = reversed;

    recursive_reverse(rest, current);
}
*/
