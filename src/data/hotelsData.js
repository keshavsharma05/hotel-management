export const hotels = {
  theluxuryinn: {
    id: "theluxuryinn",
    name: "Cozy Inn",
    location: "Lake View Road, Jaipur, Rajasthan, India",
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
      { url: "/images/hotel-property/superior_double_1.png", category: "Superior Double" },
      { url: "/images/hotel-property/superior_double_2.png", category: "Suite Details" },
      { url: "/images/hotel-property/superior_double_3.jpg", category: "Modern Living" },
      { url: "/images/hotel-property/standard_double_1.jpg", category: "Double Room" },
      { url: "/images/hotel-property/standard_double_2.jpg", category: "Cozy Corner" },
      { url: "/images/hotel-property/courtyard_1.jpg", category: "Courtyard View" },
      { url: "/images/hotel-property/courtyard_2.jpg", category: "Terrace Life" },
      { url: "/images/hotel-property/twin_1.png", category: "Twin Room" },
      { url: "/images/hotel-property/twin2.png", category: "Work Space" }
    ],
    roomCategories: [
      {
        id: 1,
        name: "Superior Double Room",
        size: "18 m²",
        capacity: "2",
        bathroom: "Ensuite (Inside)",
        images: [
          "/images/hotel-property/superior_double_1.png",
          "/images/hotel-property/superior_double_2.png",
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
          "/images/hotel-property/twin_1.png",
          "/images/hotel-property/twin2.png",
          "/images/hotel-property/twin3.png"
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
      { id: "theluxuryinn-01", roomNumber: "01", name: "Superior Double Room", price: 320, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/superior_double_1.png", description: "Largest & most premium suite. King-size bed with luxury linens, direct access to a private terrace, and large factory-style windows." },
      { id: "theluxuryinn-02", roomNumber: "02", name: "Standard Double Room", price: 250, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/standard_double_2.jpg", description: "Compact & minimalist design. Queen-size pillow-top mattress and private ensuite bathroom located on the 1st floor social hub." },
      { id: "theluxuryinn-03", roomNumber: "03", name: "Standard Room (Courtyard)", price: 180, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/courtyard_1.jpg", description: "Ground floor for ultimate peace. Direct garden & courtyard access with a private bathroom just outside the room door." },
      { id: "theluxuryinn-04", roomNumber: "04", name: "Superior Twin Room", price: 200, capacity: 2, status: "AVAILABLE", image: "/images/hotel-property/twin_1.png", description: "Two separate single beds. Bright, airy 1st floor location with a spacious workspace area and private bathroom in the hallway." }
    ],
    testimonials: [
      { id: 1, name: "Michael Chen", role: "1 month ago on Tripadvisor", content: "Absolutely stunning property! The attention to detail in the room design was impeccable. I loved the blend of modern amenities with the traditional charm. Will definitely be returning for my next vacation.", rating: 5, avatar: "https://i.pravatar.cc/150?u=michaelchen" },
      { id: 2, name: "Sarah Jenkins", role: "2 weeks ago on Booking.com", content: "One of the best stays I've ever had. The check-in process was seamless and the staff were incredibly helpful. The bed was super comfortable and the breakfast exceeded all my expectations. Highly recommended!", rating: 5, avatar: "https://i.pravatar.cc/150?u=sarahjenkins" },
      { id: 3, name: "David Roberts", role: "1 week ago on Google", content: "A true hidden gem! From the moment we arrived, we felt completely relaxed. The location is perfect, and the room was exceptionally clean. The hosts go out of their way to ensure a wonderful stay.", rating: 5, avatar: "https://i.pravatar.cc/150?u=davidroberts" },
      { id: 4, name: "Emily Nguyen", role: "3 days ago on Expedia", content: "I cannot say enough good things about Cozy Inn. The aesthetic is beautiful, the Wi-Fi is fast, and the self-service breakfast had fantastic options. It's the perfect retreat after a long day of exploring the city.", rating: 5, avatar: "https://i.pravatar.cc/150?u=emilynguyen" }
    ]
  }
};
