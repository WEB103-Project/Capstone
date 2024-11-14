# The Encyclopedia of Cars


CodePath WEB103 Final Project


Designed and developed by: Angel Garcia, Patrick Matshumba, Samir Hassan


🔗 Link to deployed app:


## About


### Description and Purpose


Cars, they're everywhere, and in the US it is a fundamental necessity on our lives to get from point A to point B on distances that on foot or on bus would take too long. So, maybe you're someone who's looking to buy a car and want to know its specs, or maybe you want to compare your car model with the previous one from last year or the latest one. Or maybe you're a mechanic and want to find the repair guide for a tough car a client came with. Whichever is the case, we all want to know more about cars! Yet despite the great need, there no "Car encyclopedia" site, per se, and the ones that may be one are hard to navigate, or dont have the information you may be searching for that maybe some obscure post have. That is why we see the need to create a website containing as much information just about any car possible. A site that car owners can help update, and share their experiences with said cars. What cars have apple car? What cars have electro-mechanical steering? Does my car have problems after reaching 100,000 miles? These are the questions we hope to answer with this *Car Encyclopedia*


### Inspiration


The idea is inspired by both our and family and friends experiences when buying our car and looking what problems a car may have in the future. While websites like the Kelley Blue Book (KBB), provide car pricing, they don't delve deeply into user experiences, potential problems, or detailed part compatibility. We want to create a comprehensive resource that provides everything car enthusiasts and mechanics need in one place.


## Tech Stack


*Frontend*: ReactJS, Tailwind CSS, NextUI


*Backend*: Express, SwaggerUI


*Database*: PostgreSQL (Railway)


*Deployment*: Vercel (Frontend) and Railway (Backend)




## Features


### Car Specifications ✅


Shows car relevant information, such as:
- MPG
- Year
- Make
- Model
- Body Type
- Picture
- Engine Type
- HP
- Cargo Volume
- Price Estimate


[View the Car Specifications](https://imgur.com/gallery/1-landing-page-2-car-specifications-3-car-comparison-tool-vTvGZgc)


### Review and Rating System


- Users will rate cars with a scale system from 1 (unreliable) to 5 (reliable). This scale applies to a set of categories such as
   - commodity
   - mileage
   - repairability
   - car resiliance (how often the car can run without breaking down)


- Users will also be able to comment about their experience with said car. Other users can reply to comments in regard with their experience as well.


[gif goes here]


### Highlighted Common Issues


- Utilizing a service like the OpenAI API, key aspects of a car such as common issues users have experienced with said car will be reported at the top of the site.


[gif goes here]


### Car Comparison Tool ✅


- The User can compare two distinct cars side by side and see their difference in a desired characteristic, such as mileage, horsepower, price, or reliability.


[View the Car Comparison Tool on Imgur](https://imgur.com/gallery/1-landing-page-2-car-specifications-3-car-comparison-tool-vTvGZgc)


### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]


### Landing Page ✅


[View the Landing Page on Imgur](https://imgur.com/gallery/1-landing-page-2-car-specifications-3-car-comparison-tool-vTvGZgc)


### Community Forum and Q&A


Tentative


## VIN Decoder


Users can find a car using the vehicle identification number or VIN


## Fuel Efficiency and Performance Analytics
- tentative, find a way to access this data from a car's computer


## Installation Instructions


First, clone the repo:


```sh
git clone https://github.com/WEB103-Project/Capstone.git
cd Capstone
```


Then install the dependencies both the `client` and the `server` requires. Once that is done, run the client and server


##### For the server


```sh
cd server
npm install
npm run start
```


##### For the client


```sh
cd client
npm install
npm run dev
```






Inspiration


https://www.kbb.com/acura/integra/1993/


https://www.edmunds.com/volkswagen/beetle/2012/review/
