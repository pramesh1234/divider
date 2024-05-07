type MyPoint = {
    latitude: number
    longitude: number
  }
  
  type MyPointOfInterest = {
     userId:string
     phoneNumber: string
     countryCode : string
     name: string
     location: MyPoint
  }