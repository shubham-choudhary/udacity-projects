var map,
    markers=[],
    locationList=[
      {title: 'BIT, MESRA', location: {lat: 23.4122599,lng: 85.43994109999994},wikiSearch: 'Birla_Institute_of_Technology,_Mesra'  },
      {title: 'Birsa Munda Airport', location: {lat: 23.3160493,lng: 85.32219329999998},wikiSearch: 'Birsa_Munda_Airport'  },
      {title: 'IIM Ranchi', location: {lat: 23.383281,lng: 85.31652789999998},wikiSearch: 'Indian_Institute_of_Management_Ranchi'  },
      {title: 'BAU Ranchi', location: {lat: 23.442301,lng: 85.31563099999994}, wikiSearch: 'Birsa_Agricultural_University' },
      {title: 'XISS Ranchi', location: {lat: 23.3682103,lng: 85.32856379999998},wikiSearch: 'Xavier_Institute_of_Social_Service' },
      {title: 'JSCA Ranchi', location: {lat: 23.3102008,lng: 85.2748345},wikiSearch: 'JSCA_International_Stadium_Complex' },
      {title: 'Kanke Ranchi', location: {lat: 23.4345371,lng: 85.32137599999999},wikiSearch: 'Kanke' },
    ];



let NeighbourhoodLocation = function(data) {
  this.title = ko.observable(data.title);
  this.location = ko.observable(data.location);
  this.wikiSearch = ko.observable(data.wikiSearch);
  this.showTitle = ko.observable(true);
};


//
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.3440997, lng: 85.30956200000003},
    zoom: 12
  });


  var largeInfowindow = new google.maps.InfoWindow();

  let ViewModel = function() {
    let self = this;
    self.extract = ko.observable();
    self.searchInput = ko.observable("");
    self.neighbourhoodList = ko.observableArray([]);
    locationList.forEach(function(element){
      self.neighbourhoodList.push(new NeighbourhoodLocation(element));
    });

    //function to filter markers as per search
      self.filterListMarkers = function (){
          self.hideMarkers();
          self.neighbourhoodList().forEach(function(locations){
            if(locations.showTitle()){
              for(let elem of markers){
                if(locations.title() == elem.title){
                  elem.setMap(map);
                }
              }
            }
        });
      };

    //queryselector to filter results as user types
        self.searchInput.subscribe(function(newValue){
              self.neighbourhoodList().forEach(function(locations){
              //console.log(locations.title())
              let filterSearch = locations.title().toLowerCase().search(newValue.toLowerCase());
              if(filterSearch == -1){
                locations.showTitle(false);
                self.filterListMarkers();
        } else {                             //to ensure if no input then all list items are displayed
            locations.showTitle(true);
            self.filterListMarkers();
           }
      });
    });

self.makeAsyncRequest = function(title,wikiSearch,marker) {
  //get wiki url for clicked item
            $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: { action: 'query',prop: 'info',inprop: 'url', titles: wikiSearch, format: 'json' },
            dataType: 'jsonp',
            timeout: 8000,
            success: function(data) {
              let wikiPageId = Object.keys(data.query.pages)[0];
              wikiURL=data.query.pages[wikiPageId].fullurl;
              largeInfowindow.setContent(`<div>${title}</div><span><h3>Wikipedia-Link: <a href="${wikiURL}">wikiURL</a>`);
              largeInfowindow.open(map,marker);
            }
          }).fail(function(error,timeout,message){
            handleAjaxError(error,timeout,message);
          });


  //get the extract from wikipedia
          $.ajax({
          url: 'https://en.wikipedia.org/w/api.php',
          data: { action: 'query',prop: 'extracts',exintro: true, titles: wikiSearch, format: 'json' },
          dataType: 'jsonp',
          timeout: 8000,
          success: function(data) {
            //console.log(data);
            let wikiPageId = Object.keys(data.query.pages)[0];
            self.extract(`<h3>Extract From Wikipedia:</h3>${data.query.pages[wikiPageId].extract}<br>`);
          }
        }).fail(function(error,value,message){
          handleAjaxError(error,value,message);
        });
};

//to show the info window of clicked item
    self.selectListItem = function(clickedItem) {
        let clickedMarker,wikiURL;
        markers.forEach(function(element){
          if(element.title == clickedItem.title()){
            clickedMarker = element;
            window.setTimeout(function(){
              element.setAnimation(null);
            },2110);
          }
        });

        self.makeAsyncRequest(clickedMarker.title,clickedItem.wikiSearch(),clickedMarker);
        toggleBounce(clickedMarker);
    };

//create and push marker
    locationList.forEach(function(elements){
      let position= elements.location;
      let title = elements.title;


      let marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener('click', function() {
        //console.log(marker);
        self.makeAsyncRequest(marker.title,elements.wikiSearch,marker);
        map.setZoom(14);
        map.setCenter(marker.getPosition());
        populateInfoWindow(this, largeInfowindow);
        toggleBounce(marker);
        window.setTimeout(function(){
          marker.setAnimation(null);
        },2110);
      });
      markers.push(marker);
    });


    map.addListener('rightclick', function(){
      map.setZoom(12);
      map.setCenter({lat: 23.3440997, lng: 85.30956200000003});
      self.showMarkers();
    });

    // This function will loop through the markers array and display them all.
    self.showMarkers = function() {
      var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (let elements of markers) {
        elements.setMap(map);
        bounds.extend(elements.position);
      }
      map.fitBounds(bounds);
    };

    self.showMarkers();

    // This function will loop through the listings and hide them all.
    self.hideMarkers = function() {
      for (let element of markers) {
        element.setMap(null);
      }
    };


  self.toggleOptionBox = function(){
    $('.options-box').toggleClass('hidden-menu');
  };

};

  ko.applyBindings(new ViewModel());

}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {

    infowindow.setContent(marker.title);
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    infowindow.open(map,marker);
  }
}

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}


function handleAjaxError(error,value,message){
  if(error.status===0){
    alert('not connected to internet');
  }else if(error.status === 404){
    alert('Page not found');
  }else if(error.status == 500){
    alert('Internal server error');
  }else if(value == 'timeout' ){
    alert('Timeout error: Ajax Timed out');
  }else if (value === 'abort') {
    alert('ajax request aborted.');
  }else{
    alert('An error occured : '+ error.statusText);
  }
}

function gmapError(){
  alert('an error occured while loading google map');
}

function gm_authFailure() {
  alert('authentication error, verify the key ');
 }
