# Georgian Water and Power Emergencies Information


GWP Emergencies is a node module that informs you that the water supply will be limited to some parts of Tbilisi region by providing date value. Please note, current version works for Tbilisi city only.

To receive information about water supply limitation you should provide date `YYYY-MM-DD` format. 


## Installation

```bash
npm install aliengreen/gwp-emergencies
```

## Usage

Date format should be `YYYY-MM-DD`. If you want to filter by street name you can specify in query parameter, the street name should be in UTF16 Georgian unicode character e.g. 'ჭავჭავაძე'; The steer name is optional and you can omit in query parameter.

Below is an example how to obtaining information about water supply limit on street name 'პოლიტკოვსკაია' in 8 May 2018.

```javascript
var gem = require('gwp-emergencies-js');

gem.get({lang: 'ka', date: '2018-05-08', street_name: 'პოლიტკოვსკაია'}, function(err, result) {
  if(err) console.log(err);

  console.log(JSON.stringify(result, null, 2));
});
```
```javascript
  [
    {
        "date": "2018-05-08", // Date format YYYY-MM-DD
        "district": "Vake", // String
        "address": "პოლიტკოვსკაიას ქ.", // String
        "building": "", // String
        "street_number": "", // String
        "restriction_date": "2018-05-08T02:30:00.000Z", // ISO 8601 date format
        "recovery_date": "2018-05-08T09:00:00.000Z", // ISO 8601 date format
        "restriction_duration": "06:30", // String
        "postponement": "NOT POSTPONED", // String
        "reason": "Damage the water supply network", // String
        "place_of_work": "პოლიტკოვსკაიას ქ. N 8-თან" // String
    }
  ]
```

You can get todays news feed list about water supply limit. See example below:

```javascript
var gem = require('gwp-emergencies-js');

gem.getNews({lang: 'ka'}, function(err, result) {
  if(err) console.log(err);

  console.log(JSON.stringify(result, null, 2));
});
```
```javascript
[
  {
    "text": "\n\nსაბურთალოს რაიონში, კანდელაკის ქ. N 10-თან, 
    წყალსადენის ქსელზე დაზიანების ლიკვიდაციის მიზნით, 07/06-ის  00:10-დან 07/06-ის
     06:00 საათამდე,წყალმომარაგება შეუწყდება:კანდელაკის, გაგარინის, ბუდაპეშტის, 
     მგალობლიშვილის, დარასელიას, ოჩამჩირის, შარტავას, ვაზისუბნის ქუჩებს, ვაჟა-ფშაველას გამზ. 
     N 1-დან 23 ჩათვლთ, პეკინის ქ. N 35-დან ზევით ნომრებს.\n\n"
  }
]
```


## Notes

- It uses `https://www.gwp.ge/en/gadaudebeli-new` "service"

## License

Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.

