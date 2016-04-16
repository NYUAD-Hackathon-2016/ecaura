// Adds a time series "series" for the organization named "org" for the feature named "feature"
// Series should be a JSON Object containing the time series.
// Ex: set(firebasepath, "AppleInc", "electricity", TimeSeriesObject)
function set(firebasepath, org, feature, series) {
	var path = firebasepath + "/orgs/" + org + "/data/" + feature;
	var featureRef = new Firebase(path);
	featureRef.set({name: feature, series: series});
}

function add_to_date(firebasepath, date, val, feature) {
	var path = firebasepath + "/dates/" + date + "/" + feature;
	var dateRef = new Firebase(path)
	dateRef.transaction(function(currentDateInfo) {
   // If /users/fred/rank has never been set, currentRank will be null.
   if (currentDateInfo == null) {
   		return {total: parseInt(val) , count: 1}
   }

  		return {total: currentDateInfo.total + parseInt(val) , count: currentDateInfo.count + 1}
	});
}

function get_average_series(firebasepath, feature) {
	var path = firebasepath + "/dates/"
	var dateRef = new Firebase(path);
	var results = new Array()

	// Query orgs that have the feature
	dateRef.orderByChild(feature + "/total").on("value", function (snapshot) {
		//console.log(snapshot.val())
		p = snapshot.val()
		// For each org, grab the orgname and the series
		for (var date in p) {
		  if (p.hasOwnProperty(date)) {
		  	results.push({date: date, average: p[date][feature]["total"]/p[date][feature]["count"]})
		    //console.log(orgname + " -> " + p[orgname]);
		  }
		}
		//console.log(results)
		//return results
	});
	return results
}

// Adds a single data to the database.
// set_date(firebasepath, "AppleInc", "electricity", "2015 June", {date: "2015 June", value:500})
function set_date(firebasepath, org, feature, date, dateobject) {
	var path = firebasepath + "/orgs/" + org + "/data/" + feature + "/series/" + date;
	var dateRef = new Firebase(path);
	dateRef.set(dateobject);
}

// Convert from the database time series format to the visualize time series format
function parse_time_series(series) {
	var series_res = new Array();
  	for (var element in series) {
  		series_res.push(series[element])
  	}
	return series_res
}

// Get the Time series for the organization "org", for the feature "feature"
// Ex: get_org_feature(firebasepath, "AppleInc", "electricity")
function get_org_feature(firebasepath, org, feature){
	var path = firebasepath + "/orgs/" + org + "/data/" + feature + "/series/";
	var featureRef = new Firebase(path)
	featureRef.on("value", function(snapshot) {
		return parse_time_series(snapshot.val());
	}, function (errorObject) {
  		console.log("The read failed: " + errorObject.code);
	});
}



// Given an organization, returns a JSON object, with key = featurename, and value = timeseries.
function get_org(firebasepath, org) {
	// Instantiate orgpath
	var orgpath = firebasepath + "/orgs/" + org + "/data/";
	var orgRef = new Firebase(orgpath);

	var results = new Object();
	orgRef.orderByKey().on("value", function (snapshot) {
		p = snapshot.val()
		// For each feature, grab the feature name and the series
		for (var feature in p) {
		  if (p.hasOwnProperty(feature)) {
		  	results[feature] = parse_time_series(p[feature]["series"]);
		  }
		}
	});
	return results;
}

// Returns a JSON Object where the key is the org, and the val is the series.
function get_feature(firebasepath, feature){

	// Instantiate orgpath
	var orgpath = firebasepath + "/orgs/";
	var orgRef = new Firebase(orgpath);
		var results = new Object()

	// Query orgs that have the feature
	orgRef.orderByChild("data/" + feature + "/name").equalTo(feature).on("value", function (snapshot) {
		//console.log(snapshot.val())
		p = snapshot.val()
		// For each org, grab the orgname and the series
		for (var orgname in p) {
		  if (p.hasOwnProperty(orgname)) {
		  	results[orgname] = parse_time_series(p[orgname]["data"][feature]["series"])
		    //console.log(orgname + " -> " + p[orgname]);
		  }
		}
		//console.log(results)
	});
		return results
}
