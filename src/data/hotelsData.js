export const hotels = {
  theluxuryinn: {
    id: "theluxuryinn",
    name: "The Luxury Inn",
    location: "London, UK",
    tagline: "Your Cozy Home Away From Home",
    heroImage: "/images/hotel-property/hero.png",
    amenities: ["Self-Service Breakfast", "Delicious Coffee", "Cozy Neighborhood", "Self check-in", "High-speed Wi-Fi"],
    roomTypeFeatures: {
      "Superior Double Room": {
        size: "18 m²",
        icons: ["Area", "Users", "Bed", "Window", "Bath", "Wind"],
        fullDetails: [
          "Largest & most premium suite",
          "King-size bed with luxury linens",
          "Private bathroom inside the room",
          "Direct access to a private terrace/patio",
          "Large factory-style windows",
          "Hair dryer",
          "Heating"
        ]
      },
      "Standard Double Room": {
        size: "11 m²",
        icons: ["Area", "Users", "Bed", "Bath", "Wind", "Shower"],
        fullDetails: [
          "Compact & minimalist design",
          "Queen-size pillow-top mattress",
          "Private ensuite bathroom",
          "Located on the 1st floor social hub",
          "Hair dryer",
          "Heating"
        ]
      },
      "Standard Room (Courtyard)": {
        size: "13 m²",
        icons: ["Area", "Users", "Bed", "Bath", "Wind"],
        fullDetails: [
          "Ground floor for ultimate peace",
          "Direct garden & courtyard access",
          "Private bathroom (just outside room door)",
          "Cooler temperature in summer",
          "Quiet retreat away from common areas"
        ]
      },
      "Superior Twin Room": {
        size: "17 m²",
        icons: ["Area", "Users", "Bed", "Bath", "Wind"],
        fullDetails: [
          "Two separate single beds",
          "Bright, airy 1st floor location",
          "Spacious workspace/desk area",
          "Private bathroom in the hallway",
          "Ideal for friends or colleagues"
        ]
      }
    },
    gallery: [
      { url: "/images/hotel-property/gallery1.jpg", category: "Property View" },
      { url: "/images/hotel-property/gallery2.jpg", category: "Interior Details" },
      { url: "/images/hotel-property/gallery3.jpg", category: "Sanctuary" },
      { url: "/images/hotel-property/hero.png", category: "Main Suite" },
      { url: "/images/hotel-property/superior_double_1.jpg", category: "Superior Double" },
      { url: "/images/hotel-property/superior_double_2.jpg", category: "Suite Details" },
      { url: "/images/hotel-property/superior_double_3.jpg", category: "Modern Living" },
      { url: "/images/hotel-property/standard_double_1.jpg", category: "Double Room" },
      { url: "/images/hotel-property/standard_double_2.jpg", category: "Cozy Corner" },
      { url: "/images/hotel-property/courtyard_1.jpg", category: "Courtyard View" },
      { url: "/images/hotel-property/courtyard_2.jpg", category: "Terrace Life" },
      { url: "/images/hotel-property/twin_1.jpg", category: "Twin Room" },
      { url: "/images/hotel-property/twin_2.jpg", category: "Work Space" }
    ],
    roomCategories: [
      {
        id: 1,
        name: "Superior Double Room",
        size: "18 m²",
        capacity: "2",
        bathroom: "Ensuite (Inside)",
        images: [
          "/images/hotel-property/superior_double_1.jpg",
          "/images/hotel-property/superior_double_2.jpg",
          "/images/hotel-property/superior_double_3.jpg"
        ],
        features: [
          "Largest & most premium suite",
          "King-size bed with luxury linens",
          "Private bathroom inside the room",
          "Direct access to a private terrace/patio",
          "Large factory-style windows"
        ]
      },
      {
        id: 2,
        name: "Standard Double Room",
        size: "11 m²",
        capacity: "2",
        bathroom: "Ensuite (Inside)",
        images: [
          "/images/hotel-property/standard_double_2.jpg",
          "/images/hotel-property/standard_double_1.jpg",
          "/images/hotel-property/standard_double_3.jpg"
        ],
        features: [
          "Compact & minimalist design",
          "Queen-size pillow-top mattress",
          "Private ensuite bathroom",
          "Located on the 1st floor social hub",
          "Perfect for budget-conscious couples"
        ]
      },
      {
        id: 3,
        name: "Standard Room (Courtyard)",
        size: "13 m²",
        capacity: "2",
        bathroom: "Private External",
        images: [
          "/images/hotel-property/courtyard_1.jpg",
          "/images/hotel-property/courtyard_2.jpg",
          "/images/hotel-property/courtyard_3.png"
        ],
        features: [
          "Ground floor for ultimate peace",
          "Direct garden & courtyard access",
          "Private bathroom (just outside room door)",
          "Cooler temperature in summer",
          "Quiet retreat away from common areas"
        ]
      },
      {
        id: 4,
        name: "Superior Twin Room",
        size: "17 m²",
        capacity: "2",
        bathroom: "Private External",
        images: [
          "/images/hotel-property/twin_1.jpg",
          "/images/hotel-property/twin_2.jpg",
          "/images/hotel-property/twin_3.jpg"
        ],
        features: [
          "Two separate single beds",
          "Bright, airy 1st floor location",
          "Spacious workspace/desk area",
          "Private bathroom in the hallway",
          "Ideal for friends or colleagues"
        ]
      }
    ],
    rooms: [
      { id: "theluxuryinn-01", roomNumber: "01", name: "Superior Double Room", price: 320, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/superior_double_1.jpg", description: "Largest & most premium suite. King-size bed with luxury linens, direct access to a private terrace, and large factory-style windows." },
      { id: "theluxuryinn-02", roomNumber: "02", name: "Standard Double Room", price: 250, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/standard_double_2.jpg", description: "Compact & minimalist design. Queen-size pillow-top mattress and private ensuite bathroom located on the 1st floor social hub." },
      { id: "theluxuryinn-03", roomNumber: "03", name: "Standard Room (Courtyard)", price: 180, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/courtyard_1.jpg", description: "Ground floor for ultimate peace. Direct garden & courtyard access with a private bathroom just outside the room door." },
      { id: "theluxuryinn-04", roomNumber: "04", name: "Superior Twin Room", price: 200, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/twin_1.jpg", description: "Two separate single beds. Bright, airy 1st floor location with a spacious workspace area and private bathroom in the hallway." }
    ],
    testimonials: [
      { id: 1, name: "Rosie Dutton", role: "3 months ago on Google", content: "Great room for when I'm there for work. Has all the facilities that you can need and James is always at the end of the phone to help with any queries etc! Much more relaxed than a hotel and the location is great! I can't wait for more visits, it feels like my home away from home!", rating: 5, avatar: "https://i.pravatar.cc/150?u=rosiedutton" },
      { id: 2, name: "Patricia Shattock", role: "5 months ago on Google", content: "Second time staying here and everything was perfect again. Whenever I come to London, I always try to book the Luxury Inn if it isn't already full! Thank you for the great amenities, breakfast, snacks and keeping it incredibly tidy considering it's self-service.", rating: 5, avatar: "https://i.pravatar.cc/150?u=patriciashattock" },
      { id: 3, name: "arlaina hilton", role: "8 months ago on Google", content: "Fabulous cozy place in a nice neighborhood. Decent breakfast and delicious coffee. Had everything I needed and comfy beds too, except! The only let down although not a huge deal, was no Netflix on TV in one of the rooms, prime video didn't work in the other room. Only mentioning this as all rooms advertised say these tv apps are available. James was a good host nevertheless", rating: 4, avatar: "https://i.pravatar.cc/150?u=arlainahilton" }
    ]
  }
};
