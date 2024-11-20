export const products = [
    {
      id: 1,
      title: "Air jordan",
      price: "$100",
      category: "men's Shoe",
      image: "/shoes/img1.jpeg",
      description: "The iconic Air Jordan is a classic basketball shoe originally designed for Michael Jordan. With a clean, athletic style, it delivers both performance and comfort. Whether you're hitting the courts or just showing off your style, this shoe is an all-time favorite among sneakerheads. Featuring a durable sole and premium construction, it is designed for men looking for both style and substance. This shoe is great for both casual wear and performance on the basketball court.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Air'
        let b = this.title.split(" ")[1].toLowerCase(); // 'jordan'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 2,
      title: "Stan Maquine",
      price: "$150",
      category: "men's Shoe",
      image: "/shoes/img2.jpeg",
      description: "The Stan Maquine is a stylish men’s sneaker that blends a retro design with modern materials. It’s perfect for everyday wear with its lightweight and breathable design. Whether you're heading to work or a casual outing, the shoe offers maximum comfort. It features a unique colorway and sleek design, making it a versatile addition to any wardrobe. Its minimalistic yet sophisticated look makes it ideal for casual and semi-formal occasions.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Stan'
        let b = this.title.split(" ")[1].toLowerCase(); // 'Maquine'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 3,
      title: "Air for One",
      price: "$200",
      category: "men's Shoe",
      image: "/shoes/img3.jpeg",
      description: "Air for One is a premium men’s athletic shoe that combines comfort, durability, and style. With its iconic design and advanced cushioning, this shoe is made for people on the go. It’s perfect for men who appreciate a high-performance sneaker that works equally well for casual outings or physical activities. Its sleek, contemporary look is ideal for modern men who prioritize both aesthetics and function.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Air'
        let b = this.title.split(" ")[1].toLowerCase(); // 'for'
        let c = this.title.split(" ")[2].toLowerCase(); // 'One'
        let result = a + "-" + b + "-" + c + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 4,
      title: "Stan Smith",
      price: "$500",
      category: "men's Shoe",
      image: "/shoes/img4.jpeg",
      description: "The Stan Smith is a globally recognized, classic tennis shoe that has evolved into a fashion statement. Known for its clean white leather exterior, the shoe features a minimalist design with perforated details for breathability. With a comfortable, supportive fit, it’s suitable for both athletic use and everyday style. The premium leather and durable construction make this shoe a long-lasting investment for those looking for a high-quality product.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Stan'
        let b = this.title.split(" ")[1].toLowerCase(); // 'Smith'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 5,
      title: "Alexander maquine",
      price: "$270",
      category: "men's Shoe",
      image: "/shoes/img5.jpeg",
      description: "The Alexander Maquine is a high-end sneaker that combines luxury materials with modern design. Featuring a sophisticated color palette and sleek construction, this shoe is ideal for fashion-conscious men who want to stand out. It offers maximum comfort, thanks to its ergonomic design and premium cushioning. Whether you're at a social event or just looking to elevate your casual outfit, the Alexander Maquine delivers both style and quality.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Alexander'
        let b = this.title.split(" ")[1].toLowerCase(); // 'maquine'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 6,
      title: "Air max",
      price: "$280",
      category: "men's Shoe",
      image: "/shoes/img6.jpeg",
      description: "The Air Max is a performance-oriented shoe known for its innovative air cushioning system that ensures comfort with every step. This iconic sneaker has been a favorite of athletes and casual wearers alike due to its stylish, futuristic design and unbeatable comfort. Whether you're running, working out, or out for a casual stroll, the Air Max offers excellent support and looks great with almost any outfit. The lightweight yet durable design makes it a versatile choice for everyday wear.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Air'
        let b = this.title.split(" ")[1].toLowerCase(); // 'max'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 7,
      title: "New Balance",
      price: "$350",
      category: "men's Shoe",
      image: "/shoes/img7.jpeg",
      description: "New Balance sneakers are renowned for their exceptional comfort and support. Designed with the latest technology, this shoe is built to provide maximum cushioning while maintaining a lightweight feel. Perfect for both sports enthusiasts and casual wearers, the New Balance shoe features a sleek, modern look with an emphasis on performance. Its high-quality materials and innovative design make it a great option for anyone looking to invest in a long-lasting, comfortable sneaker.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'New'
        let b = this.title.split(" ")[1].toLowerCase(); // 'Balance'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  
    {
      id: 8,
      title: "Nike cortez",
      price: "$850",
      category: "men's Shoe",
      image: "/shoes/img7.jpeg",
      description: "The Nike Cortez is a classic running shoe that has transcended its original purpose to become a symbol of style and comfort. Its vintage design, including the iconic swoosh and soft leather upper, make it a favorite among sneaker enthusiasts and casual wearers alike. The lightweight, cushioned sole offers great comfort, while the retro aesthetic ensures it stands out in any crowd. Whether you're hitting the gym or going for a casual walk, the Nike Cortez is a versatile and stylish option that continues to be a fan favorite.",
      slugFun: function () {
        let a = this.title.split(" ")[0].toLowerCase(); // 'Nike'
        let b = this.title.split(" ")[1].toLowerCase(); // 'cortez'
        let result = a + "-" + b + "-" + new Date().getDay() + this.id;
        return result;
      },
      get slug() {
        return this.slugFun(); // Calculate the slug dynamically
      },
    },
  ];