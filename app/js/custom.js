function initializeWidget()
{
	var recordData,msg;
	var success_message = "Message sent successfully!";
	var Message = document.getElementById("Message");
	var popup_body = document.getElementById("popup-body");

	var selectElem = $("#select");
	
	/*
	 * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
	 */
	ZOHO.embeddedApp.on("PageLoad",function(data)
	{
		

		/*
	 	 * Verify if EntityInformation is Passed 
	 	 */
		if(data && data.Entity)
		{
			/*
		 	 * Fetch Information of Record passed in PageLoad
		 	 * and insert the response into the dom
		 	 */
			ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId})
			.then(function(response)
			{
				response.data.forEach((data,index) => {
					// document.getElementById("list").innerHTML = index;
					"Owner $photo_id $currency_symbol $review_process $upcoming_activity $review $state $converted $process_flow $approved $approval $converted_detail $editable $orchestration $in_merge $status $approval_state".split(" ").forEach(e => delete data[e]);
					console.log(data.Mobile);
					var tableData = `
					<tbody>
					<tr>
					<td scope="row">${index+1}</td>
		            <td>${data.Full_Name}</td>
					<td>${data.Mobile}</td>
					<td>${data.Email}</td>
					</tr>
					</tbody>
									`;
				$("#table").append(tableData);
    				// document.getElementById("recordInfo").innerHTML = JSON.stringify(response,null,2);
				});	//Foreach

				$.each(response.data[0], function(index, value){
					console.log(index + "   " + value);
					$("<option/>", {
						value: index,
						text: index
					}).appendTo(selectElem);
				});
				


				//Inserting Fields in Message box
				$("#Insert").on('click', function() {
					// $txt.html(this);
					var caretPos = Message[0].selectionStart;
					var textAreaTxt = Message.val();
					var txtToAdd = "#" + selectElem.val();
					Message.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos) );
				});
			
				
				$("#send").click(function() {
				response.data.forEach((item,index) => {
					post(item);
				});	
				});//Close foreach 2nd
				
				function post(item){
					var msg = Message.value.replace(/ /g, "%20");
					if (msg != "" || msg != null) {
		
					console.log(msg);
					var request = {
					url : "https://api.msg91.com/api/sendhttp.php?mobiles="+item.Mobile+"&message="+msg+"&route=4&authkey=296316AS0Ui3d5OE5f208b7cP1&sender=SqftRe",
			// params:{
			// 	mobiles:"919603263741",
			// 	message:Message,
			// 	route:"4",
			// 	authkey:"296316AS0Ui3d5OE5f208b7cP1",
			// 	sender:"SqftRe"
			// }
					}
		
				// 	// http://182.18.170.178/api.php?username=nipunatechnologies&password=335933&to=919603263741&from=NIPUNA&message=testing
					ZOHO.CRM.HTTP.post(request)
					.then(function(data){
						if (data.length == 24) {
							popup_body.innerHTML = "Message sent successfully!";
							$("#model-button").click();
							createrecord(item,success_message);
						}
						else{
							// popup_body.innerHTML = JSON.parse(data.response);
							popup_body.innerHTML = data;
							$("#model-button").click();
							createrecord(item,JSON.parse(data.response));
						}
						console.log(Message.value);
						console.log(data);
					})

					}
					else{
						alert("Message can't be empty!!");
					}

				}//Post function END;

			     //Create Record (Log)
				function createrecord(item,status)
				{
				  recordData = {
				  "Message": msg,
				  "Name": "Outgoing SMS",
				  "Lead": item.id,
				  "To": item.Phone,
				  "Status": status,
			}
		  ZOHO.CRM.API.insertRecord({Entity:"MSG_Logs",APIData:recordData,Trigger:["workflow"]}).then(function(data){
			console.log(data);
		   // alert(data);
			  });
		   }
				
				//Closing UI Popup Widget
				$("#close-btn").click(function() {
					console.log("closed");
				   ZOHO.CRM.UI.Popup.closeReload()
				   .then(function(data){
					   console.log(data)
				   })
				});


		});//Get Record

	}//Data Entity

		

	

		/*
		 * Fetch Current User Information from CRM
		 * and insert the response into the dom
		 */
		// ZOHO.CRM.CONFIG.getCurrentUser()
		// .then(function(response)
		// {
		// 	document.getElementById("userInfo").innerHTML = JSON.stringify(response,null,2);
		// });
		
	});

	
	/*
	 * initialize the widget.
	 */
	ZOHO.embeddedApp.init();
}