// Adds a time series "series" for the organization named "org" for the feature named "feature"
// Series should be a JSON Object containing the time series.
// Ex: set(firebasepath, "AppleInc", "electricity", TimeSeriesObject)
function set(firebasepath, org, feature, series) {
	var path = firebasepath + "/orgs/" + org + "/data/" + feature;
	var featureRef = new Firebase(path);
	featureRef.set({name: feature, series: series});
}

// Get the Time series for the organization "org", for the feature "feature"
// Ex: get_org_feature(firebasepath, "AppleInc", "electricity")
function get_org_feature(firebasepath, org, feature){
	var path = firebasepath + "/orgs/" + org + /data/ + feature;
	var featureRef = new Firebase(path)
	featureRef.on("value", function(snapshot) {
		return snapshot.val()
	}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});
}

// Given an organization, returns a JSON object, with key = featurename, and value = timeseries.
function get_org(firebasepath, org) {
	// Instantiate orgpath
	var orgpath = firebasepath + "/orgs/" + org + /data/;
	var orgRef = new Firebase(orgpath);

	orgRef.orderByKey().on("value", function (snapshot) {
		p = snapshot.val()
		var results = new Object()
		// For each feature, grab the feature name and the series
		for (var feature in p) {
		  if (p.hasOwnProperty(feature)) {
		  	results[feature] = p[feature]["series"]
		  }
		}
		//console.log(results)
		return results
	})
	return
}

// Returns a JSON Object where the key is the org, and the val is the series.
function get_feature(firebasepath, feature){

	// Instantiate orgpath
	var orgpath = firebasepath + "/orgs/";
	var orgRef = new Firebase(orgpath);

	// Query orgs that have the feature
	orgRef.orderByChild("data/" + feature + "/name").equalTo(feature).on("value", function (snapshot) {
		//console.log(snapshot.val())
		p = snapshot.val()
		var results = new Object()
		// For each org, grab the orgname and the series
		for (var orgname in p) {
		  if (p.hasOwnProperty(orgname)) {
		  	results[orgname] = p[orgname]["data"][feature]["series"]
		    //console.log(orgname + " -> " + p[orgname]);
		  }
		}
		//console.log(results)
		return results
	});
}
