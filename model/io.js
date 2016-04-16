
function set(firebasepath, org, feature, series) {
	var path = firebasepath + "/orgs/" + org + "/data/" + feature;
	var featureRef = new Firebase(path);
	featureRef.set({name: feature, series: series});
}

// Get the 
function get_org_feature(firebasepath, org, feature){
	var path = firebasepath + "/orgs/" + org + /data/ + feature;
	var featureRef = new Firebase(path)
	featureRef.on("value", function(snapshot) {
		return snapshot.val()
	}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});
}

function get_org(firebasepath, org) {
	return
}


function get_feature(firebasepath, feature){
	return
}
