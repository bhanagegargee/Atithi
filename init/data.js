const sampleListings = [
  // ============================================================
  // KERALA - 4 LISTINGS
  // ============================================================

  {
    title: "Traditional Kerala Houseboat Stay",
    description:
      "Experience the serene backwaters of Kerala from a traditional houseboat. Enjoy peaceful waterways, coconut palms, village views, and authentic Kerala hospitality.",
    image: {
      filename: "kerala-houseboat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049100/XIZVD2DJy4-h1dtKiLttiqQs6MW6ltykVJSvA1ZrUZvtb6Q8hh-ghxztb_Pfe8Pk4guXwHzGt-ldPgAxBrrarIzGfa0wh1B5zOfBn6gMFCwCWcOcGLbNeQpPZX8Mq7MA2pLsy2Q0ftEU5_ZXBFvtbCPm7OqTmDzblXm3WRkYAfDYDRwSDr72303_jyQorSGg.jpg" },
    price: 4500,
    location: "Alleppey",
    country: "India",
    state: "Kerala",
    coordinates: {
      latitude: 9.4981,
      longitude: 76.3388,
    },
    geometry: {
      type: "Point",
      coordinates: [76.3388, 9.4981],
    },
  },

  {
    title: "Heritage Homestay in Fort Kochi",
    description:
      "Stay in a charming heritage-style homestay in Fort Kochi, surrounded by colonial architecture, historic streets, art galleries, and the famous Chinese fishing nets.",
    image: {
      filename: "fort-kochi-heritage",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049198/jqxdSVWReYMPLowZPpNpKWbpTfwho8vEThv82TodSJNVy5FleEftD-_BvrdCEOIX36pt7QD3lTV6P22xlKk8EX_AIUo28ZEmVwMcIJtRUyP51a7fm9U8HAY3GSvIIRmZfwJ6qx1bVQar5MvibKAvRfjPIIhWxYopqSkaX_4PX7bUU--JiCiAtu1F9FffvWUG.jpg"
     },
    price: 2800,
    location: "Fort Kochi",
    country: "India",
    state: "Kerala",
    coordinates: {
      latitude: 9.9658,
      longitude: 76.2421,
    },
    geometry: {
      type: "Point",
      coordinates: [76.2421, 9.9658],
    },
  },

  {
    title: "Munnar Tea Garden Retreat",
    description:
      "Relax among the rolling tea plantations of Munnar. This peaceful mountain retreat offers refreshing views, cool weather, and easy access to Kerala's scenic Western Ghats.",
    image: {
      filename: "munnar-tea-retreat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049225/fs5i1Cs85ZQoOg-d1NVCxm_fmH5KSEAavSGEWwxLdpplgCiy0CNpTvmu-KwSnr4HzF1ZAtCeoeJBqo_CSJ9514rahD4t_H7YZns-ffUAz-LTG6N2vxICWmJIZNbxx--YpxHSrer1z7exegxK7u69c4mSZ8OuUcpp3HkSY7u11jO2Igm_EeLPT_Vqnub0zP07.jpg"
    },
    price: 3200,
    location: "Munnar",
    country: "India",
    state: "Kerala",
    coordinates: {
      latitude: 10.0889,
      longitude: 77.0595,
    },
    geometry: {
      type: "Point",
      coordinates: [77.0595, 10.0889],
    },
  },

  {
    title: "Varkala Cliff Beach Cottage",
    description:
      "Stay close to the spectacular Varkala cliffs and Arabian Sea. Enjoy a relaxed coastal atmosphere with access to beaches, local cafés, and Kerala's famous Ayurvedic experiences.",
    image: {
      filename: "varkala-cliff-cottage",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049240/YDHcZqaDmC-I5A92PLECeG0wVHXCkQfWATJrBzPtbllqp50N0-cPv0YndJkX65JgVfQ1rYkvBu7TieGy-UHAIDUCNkJNU_UYNdkpam4-3vrAgghftfk3HFvTxbG6lH1f64I_nvfi3jUsaPJnMzAJwkoM58ctpwcoMhiJpvLfgrE5mWznnrtCUfR7jZqS5BA4.jpg"
     },
    price: 2500,
    location: "Varkala",
    country: "India",
    state: "Kerala",
    coordinates: {
      latitude: 8.7379,
      longitude: 76.7163,
    },
    geometry: {
      type: "Point",
      coordinates: [76.7163, 8.7379],
    },
  },


  // ============================================================
  // MAHARASHTRA - 4 LISTINGS
  // ============================================================

  {
    title: "Sea View Apartment in Mumbai",
    description:
      "Stay in the heart of Mumbai with easy access to Marine Drive, Colaba, Gateway of India, and the city's vibrant food and cultural scene.",
    image: {
      filename: "mumbai-seaview",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049272/eu8FW1tkHbGEby_ZQdPXRD_0aj7_KJpn7hTQEr2N4XZA3UST1Ta_usEraqrkAcR6Lb0_ZjXhJqOvMX6m9BEOSyIC3GWb6QMZatIr7yp80eV9_GAGfemUKWDQz4GF2uL_vjcUBMbrJk1zUz-VElakIWHxZuSaI495l0DzuSKCr2McI07SvXLwI5TlLuI9C3yi.jpg"
     },
    price: 3500,
    location: "Mumbai",
    country: "India",
    state: "Maharashtra",
    coordinates: {
      latitude: 19.076,
      longitude: 72.8777,
    },
    geometry: {
      type: "Point",
      coordinates: [72.8777, 19.076],
    },
  },

  {
    title: "Lonavala Mountain Villa",
    description:
      "Escape to the green hills of Lonavala in this peaceful villa. Surrounded by Western Ghats scenery, it is ideal for a relaxing weekend away from the city.",
    image: {
      filename: "lonavala-villa",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049298/1B24VmHDcT88w4agtkZsfA0C_3qhaLmK_lN8_-zjnYnq2CJ0yQidnlOR30VE8WVNeNwPRuJY-9PT4tpB4qiSLhLBsQRB1tXyBS-FfaKRRT5Izwg3BoMsewHTT3iaB4Ms_q_KGp2Hi9iJSzTpO5B-Ce0dpyWM3YO9IhrEYEEhj3rlXWYSLcfVoKOWuV1gijIc.jpg"
     },
    price: 3000,
    location: "Lonavala",
    country: "India",
    state: "Maharashtra",
    coordinates: {
      latitude: 18.7546,
      longitude: 73.4062,
    },
    geometry: {
      type: "Point",
      coordinates: [73.4062, 18.7546],
    },
  },

  {
    title: "Konkan Coastal Homestay",
    description:
      "Experience the relaxed lifestyle of the Konkan coast from a traditional homestay near Ratnagiri. Enjoy local seafood, coconut groves, beaches, and authentic Maharashtrian hospitality.",
    image: {
      filename: "konkan-homestay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049329/YnTxlbuRbT4gux-NiX2GbDGMewcFab1oitXrQKKaYToWkQyfWZq13wOxDdibGPBpQ-HFYnFxijVALAT5sQRv5m9S42o7xFhoQmI9ryE5zGTXigjVIa8elE8rGPobr9KOgibOS5njQ6xFZ_UepdBFTVVDgded-WXhsxBQj1OnW84bkHAomIR_y91CXVNB_0ll.jpg"
     },
    price: 2200,
    location: "Ratnagiri",
    country: "India",
    state: "Maharashtra",
    coordinates: {
      latitude: 16.9902,
      longitude: 73.312,
    },
    geometry: {
      type: "Point",
      coordinates: [73.312, 16.9902],
    },
  },

  {
    title: "Mahabaleshwar Valley Retreat",
    description:
      "Enjoy panoramic views of the Sahyadri hills from this comfortable retreat in Mahabaleshwar. Explore viewpoints, strawberry farms, forests, and nearby waterfalls.",
    image: {
      filename: "mahabaleshwar-retreat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049304/LmclduY-L0fLfjH4F32hLK0S6whmxbT7OIHBgAA87bTgwsLglZ2zg22Rokn5D-D_vA-tsqY7wm1zu-Peo7BJeEHv7hii7adLc25B4nnlzuLcSUuXp6bggEe-XbsCHpd8sLIopzTP4ioXk9E10vntl01HvCfWSfMerl4-JEzsLQ5odZg6uljMzpmQqk_EJIsY.jpg"
     },
    price: 2800,
    location: "Mahabaleshwar",
    country: "India",
    state: "Maharashtra",
    coordinates: {
      latitude: 17.9307,
      longitude: 73.6477,
    },
    geometry: {
      type: "Point",
      coordinates: [73.6477, 17.9307],
    },
  },


  // ============================================================
  // GOA - 4 LISTINGS
  // ============================================================

  {
    title: "Portuguese Heritage Villa in Panaji",
    description:
      "Stay in a charming Portuguese-inspired heritage villa near Panaji. Explore colorful streets, historic churches, local markets, and Goa's unique Indo-Portuguese culture.",
    image: {
      filename: "goa-heritage-villa",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049347/kk5ukIcF0rOLFDqbji9IS61K1Gh36MxiFDDF6nXD6cMFABQyc0KdgXi6voicQ6vZe53FlW6CdFaKnL8hlYRlwnxTUf6W2hiHpk-vGCud4MNCfhi0ojkyeT4nKvdB4ChwbAaAX6hct6hvZ4FQ811XYLfuItUaoZm4wNlEkiJ73O0aBuci2HsRO2nyM1z2JpBs.jpg"
     },
    price: 3800,
    location: "Panaji",
    country: "India",
    state: "Goa",
    coordinates: {
      latitude: 15.4909,
      longitude: 73.8278,
    },
    geometry: {
      type: "Point",
      coordinates: [73.8278, 15.4909],
    },
  },

  {
    title: "Beach Cottage in Calangute",
    description:
      "Enjoy a classic Goa beach holiday from this comfortable cottage near Calangute Beach. Relax by the Arabian Sea and explore nearby restaurants, markets, and nightlife.",
    image: {
      filename: "calangute-beach-cottage",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049377/BFOpozZ8iqZHW75nrkyrnd45VEmJXefZmIj7STZol6rySV8YBNNGConH2D5YiqsD_dgkYXhUxNU8M6R5GCVSR-t_LR0zHlPFTf8EFZzmqvB7mJxMRJqKL9x3hXaVHf6p1_6XLqpVad_rPJgJvWtvou-zypK_v37UZ2GK1M9vnIyEzb95i0pp-a6LbNE4VskZ.jpg"
    },
    price: 3000,
    location: "Calangute",
    country: "India",
    state: "Goa",
    coordinates: {
      latitude: 15.5449,
      longitude: 73.755,
    },
    geometry: {
      type: "Point",
      coordinates: [73.755, 15.5449],
    },
  },

  {
    title: "Palolem Beach Eco Stay",
    description:
      "Relax near the beautiful crescent-shaped Palolem Beach in a peaceful eco-friendly stay surrounded by palm trees and the natural beauty of South Goa.",
    image: {
      filename: "palolem-eco-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049395/cFF5LniDXJ9xt0lf4ZJ-gYxO2wRK6V2JiCfuNGdhBMwcPniw7IYpdimKo6rKV3PBACW7T7KhrNlT1kLkihm_qmAxodU5fxe7pCJ7buHRr9lqJIqB4B7h5TFm3np-JXx44oGW9DADm1mODb7Kl_fvyLQ3pXV7jAj0WfHqbbgVg_kkPs_GBJZ7cSyy3UwlT1t0.jpg"
    },
    price: 2700,
    location: "Palolem",
    country: "India",
    state: "Goa",
    coordinates: {
      latitude: 15.0101,
      longitude: 74.023,
    },
    geometry: {
      type: "Point",
      coordinates: [74.023, 15.0101],
    },
  },

  {
    title: "Fontainhas Cultural Stay",
    description:
      "Experience Goa's colorful Latin Quarter in Fontainhas. Stay close to traditional Portuguese-style houses, art spaces, cafés, and the cultural heritage of Panaji.",
    image: {
      filename: "fontainhas-cultural-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049416/uagvrDh4xOHUBgKHubpwHMZFZdN_g1IN3s_upzesEvpgr92QoNh_tufRtA1czDQL9woUJjaQWbuqLCtIl7tj8nhbEsiEUdaD-z4DGEd6pOjnnU1Q2ghZ2u5n2OSxUVWRQaa0Jg21lNLFCgWOBB8SBcy6ldvKNnMI05OTfjD1uVWOOGCUnnRm6mjR77emDaMh.jpg"
    },
    price: 2600,
    location: "Fontainhas, Panaji",
    country: "India",
    state: "Goa",
    coordinates: {
      latitude: 15.494,
      longitude: 73.829,
    },
    geometry: {
      type: "Point",
      coordinates: [73.829, 15.494],
    },
  },


  // ============================================================
  // GUJARAT - 4 LISTINGS
  // ============================================================

  {
    title: "Heritage Haveli in Ahmedabad",
    description:
      "Stay in a traditional heritage haveli and experience Ahmedabad's historic pol houses, local markets, traditional cuisine, and rich architectural heritage.",
    image: {
      filename: "ahmedabad-haveli",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049452/BmioZEedAeSw0RhpQYA0BZnwBL8qNFUR5RCLn_hlfGFzaXldWjci-MeWUxrgdPCq0j_cvzXMyUw5qXipVd7bwTWZjpos3ikT3RB6szrNyx9YBXci4HLCi6Imr7MgnfFxWwW-J_u0TpeZ7mjAwJYTFsTbBs1TkLmALCfbPt3sc8Ig3MIGZGaOJX9c7aT3IiU2.jpg"
    },
    price: 2500,
    location: "Ahmedabad",
    country: "India",
    state: "Gujarat",
    coordinates: {
      latitude: 23.0225,
      longitude: 72.5714,
    },
    geometry: {
      type: "Point",
      coordinates: [72.5714, 23.0225],
    },
  },

  {
    title: "White Rann Desert Camp",
    description:
      "Experience the magical white salt desert of Kutch from a traditional-style desert camp. Enjoy local handicrafts, folk performances, and the unique landscape of the Rann.",
    image: {
      filename: "rann-of-kutch-camp",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049526/xooHx8XBS2EfmHaxTLjHr3XKzj69LKma1lDqeTAniV2k11BvFkVNA2KFQvhByDsMRJ6bDlA9qrBRNetvI4n1c4uM4dWXHTZ550DpiN_k6KZFTrCRGHLRJTwWTgHCA03Ggap6xlmF3xeCraW4xqjYgBduNsFOpUIub8HEwDiN7oq-u1U__BbiLBEkF6Op5mLQ.jpg"
    },
    price: 4200,
    location: "Dhordo, Kutch",
    country: "India",
    state: "Gujarat",
    coordinates: {
      latitude: 23.8393,
      longitude: 69.7014,
    },
    geometry: {
      type: "Point",
      coordinates: [69.7014, 23.8393],
    },
  },

  {
    title: "Royal Palace Stay in Vadodara",
    description:
      "Discover the royal heritage of Vadodara from this elegant heritage accommodation. Visit magnificent palaces, museums, gardens, and experience Gujarat's cultural traditions.",
    image: {
      filename: "vadodara-heritage-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049539/wilPC3rZcZ2wXcclMR-CphPdotTrz7xkf8mEbnLxQnCAGNaXAemFqbwbFBsFiEZN7lgY1pmiMwt6SPckRZF9jx4m4a7uObX7WjeBAetUv1xWdw-dhZudAgDTajM_zqv_mfsiKiXfpyj1OOP-n-_bfOEIOQoEx_npO3rNwJ8I7aP8WXOl7UBP66iYFxMU9ber.jpg"
     },
    price: 3200,
    location: "Vadodara",
    country: "India",
    state: "Gujarat",
    coordinates: {
      latitude: 22.3072,
      longitude: 73.1812,
    },
    geometry: {
      type: "Point",
      coordinates: [73.1812, 22.3072],
    },
  },

  {
    title: "Somnath Coastal Retreat",
    description:
      "Stay near the Arabian Sea in Somnath and explore the famous Somnath Temple, coastal landscapes, and the spiritual and cultural heritage of Saurashtra.",
    image: {
      filename: "somnath-coastal-retreat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049545/48hOEb5SKlQz-a_cBKrdj2g9k_ljjU4JxyNk5dz3JLZPIxvY72VbGbEFamjlYWPwM5KyAkjVCWAAcMVGzqW-gqvbICj4Asa-tHsMLGsnw5KnxW2PRWZwMUTWPx36WwB5p4obrIKwPyIG15cwoDTF8GSVRx3lsFwci2odE0aIvVnedv8r7oi0JdMJAEg562lR.jpg"
     },
    price: 2400,
    location: "Somnath",
    country: "India",
    state: "Gujarat",
    coordinates: {
      latitude: 20.888,
      longitude: 70.401,
    },
    geometry: {
      type: "Point",
      coordinates: [70.401, 20.888],
    },
  },


  // ============================================================
  // RAJASTHAN - 4 LISTINGS
  // ============================================================

  {
    title: "Royal Haveli in Jaipur",
    description:
      "Experience Rajasthan's royal heritage from a traditional haveli in Jaipur. Explore historic forts, colorful bazaars, palaces, and the city's famous Rajasthani cuisine.",
    image: {
      filename: "jaipur-royal-haveli",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049598/NgBiN8FKPTSIDO5T3m6B2GXcZguytbzl7R9j8qR-NGRfDXwb1uMY_BVmuIPmvaG6UBlO0pxmoUgcGG-wFDr22LUl4l_CMewCUcglyCCQYADzRLwxV9Wrrr__ALjP1SBdyOeMFKSqIFKX3g2Pg90sAaF5t_7241t7H9Jkrm-dERPucwHplsSzRkXsqw5sdc_k.jpg"
     },
    price: 3500,
    location: "Jaipur",
    country: "India",
    state: "Rajasthan",
    coordinates: {
      latitude: 26.9124,
      longitude: 75.7873,
    },
    geometry: {
      type: "Point",
      coordinates: [75.7873, 26.9124],
    },
  },

  {
    title: "Desert Camp in Jaisalmer",
    description:
      "Spend a memorable night in the Thar Desert near Jaisalmer. Enjoy camel rides, traditional folk music, local food, and spectacular sunset and sunrise views over the dunes.",
    image: {
      filename: "jaisalmer-desert-camp",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049616/mo5J6UMVUhFoP4alosQphYIemul8s2_cK0xLEUcnP2EYR51ygu3O_grrljRkViU7iPeOYB2sazKZt5ZKjLf5S8fGUVae6QYKGEFkLh8Lp0AjzgwerNONyEbkZD1BBMH86OWhoxOv8U0Fu3QVKTCnJvNlOHCNK5Q5-FE18tXH-mXN2nmYuxgnYKW7ILsKF3fC.jpg"
    },
    price: 4000,
    location: "Sam Sand Dunes, Jaisalmer",
    country: "India",
    state: "Rajasthan",
    coordinates: {
      latitude: 26.8722,
      longitude: 70.5279,
    },
    geometry: {
      type: "Point",
      coordinates: [70.5279, 26.8722],
    },
  },

  {
    title: "Lake Palace View Stay in Udaipur",
    description:
      "Enjoy the romantic atmosphere of Udaipur from a traditional stay overlooking the city's lakes and historic architecture. Perfect for experiencing Mewar's rich heritage.",
    image: {
      filename: "udaipur-lake-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049626/CIRF2AhfApx_tAv_iHZ5PHoN6GZH3_5Ck0S93uCWs_kMRwvmI7WXK0sPmdlra9k4cKeabU9xEG8FnNiqjjSngmYGHIUdHMigazU_2X2gS9Vw_qJhGnaK1FmSHqtkZsQQ5xbipr5ryJ9TTTeU5LpFa-WhH08A7sAhqR9SJ4ubBNGVLY_-YC38Oi2UgGYl_SJj.jpg"
    },
    price: 4200,
    location: "Udaipur",
    country: "India",
    state: "Rajasthan",
    coordinates: {
      latitude: 24.5854,
      longitude: 73.7125,
    },
    geometry: {
      type: "Point",
      coordinates: [73.7125, 24.5854],
    },
  },

  {
    title: "Blue City Heritage Home",
    description:
      "Stay inside the historic character of Jodhpur's old city and experience its famous blue houses, local markets, traditional food, and views of Mehrangarh Fort.",
    image: {
      filename: "jodhpur-blue-home",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049632/2aDjNNruafTSr_fAlOmd_o682QWl5022UGfKhZNCmDb5_CocHqIpP7hEzYa-s1ASekYyLJpa4kdYUNvHeN9KFUz4qXCWb1W0XBnoJ1H5zLHLceM17AqTmhbLrcU1P5wKXaDwsIMq_3ByV6Ms_FTxzrorIO9HAzooBhiDi3SBjy7Y1XYKnk8s4AjMBRRsCUJV.jpg"
    },
    price: 2800,
    location: "Jodhpur",
    country: "India",
    state: "Rajasthan",
    coordinates: {
      latitude: 26.2389,
      longitude: 73.0243,
    },
    geometry: {
      type: "Point",
      coordinates: [73.0243, 26.2389],
    },
  },


  // ============================================================
  // JAMMU AND KASHMIR - 4 LISTINGS
  // ============================================================

  {
    title: "Dal Lake Houseboat Stay",
    description:
      "Experience the beauty of Kashmir from a traditional houseboat on Dal Lake. Enjoy mountain views, peaceful waters, shikara rides, and the unique culture of Srinagar.",
    image: {
      filename: "dal-lake-houseboat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049685/8Hvy1mBDK62VKrLvMZFbAkxZ9NELS48WfCVNQMKn5JQDGlYtw-XIzE51Kk38llzo9PSBPdvcO5XyVmiG7sypF-fk68d8UahcxJQ0f4PG3XhKrRSXKBpSTmL9GEbMz75BoJWXKA8LNMPQ4ueoJhERBkw3esLGeMkDKqd-sMxyft5KH3vgiXoJNPsWGCpfrrsA.jpg"
     },
    price: 4500,
    location: "Srinagar",
    country: "India",
    state: "Jammu and Kashmir",
    coordinates: {
      latitude: 34.0837,
      longitude: 74.7973,
    },
    geometry: {
      type: "Point",
      coordinates: [74.7973, 34.0837],
    },
  },

  {
    title: "Gulmarg Mountain Chalet",
    description:
      "Stay among the mountains of Gulmarg with easy access to scenic trails and the famous ski slopes. Enjoy fresh mountain air and spectacular views of the Himalayas.",
    image: {
      filename: "gulmarg-chalet",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049702/PrbXstcb8r_YyTObyaQUeFsIuhSlii2Br10mku7-kfXhgpPsvTQEy_nMZM9LaknDKWP9w8lnPNDBAKHFRrbGHlUtCF23uSIPt1O9fhXEuBXl8tzKHyndX9_nq6fIXegzFPtZMYYzn8wiLCCn0nc1NSrSNOR_ndasEU5u_ny63TEt2xuyQyHRbk9NT0-cb03d.jpg"
    },
    price: 4000,
    location: "Gulmarg",
    country: "India",
    state: "Jammu and Kashmir",
    coordinates: {
      latitude: 34.0484,
      longitude: 74.3805,
    },
    geometry: {
      type: "Point",
      coordinates: [74.3805, 34.0484],
    },
  },

  {
    title: "Pahalgam Valley Retreat",
    description:
      "Relax in the scenic Pahalgam valley surrounded by forests, rivers, and Himalayan landscapes. A peaceful base for exploring Kashmir's natural beauty.",
    image: {
      filename: "pahalgam-valley-retreat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049709/0-xZ3My2Egy6t_27RBlGinsY-m3TB2mtYOWYd6jlYluvvjm5yZSWXTWuH4HH2q-HHzAW-rOxKMMgRmoI2M1OjdFagJAdgEIcznP5uROJGL73vryBn7pVE1WTNRsAAgm2jxsnwsF4cKu8Yit5Svq8Ke-77YYpqj4b63bFvLqb0sR0KiWYcXyJ0eg3MweEabJX.jpg"
    },
    price: 3200,
    location: "Pahalgam",
    country: "India",
    state: "Jammu and Kashmir",
    coordinates: {
      latitude: 34.0161,
      longitude: 75.315,
    },
    geometry: {
      type: "Point",
      coordinates: [75.315, 34.0161],
    },
  },

  {
    title: "Sonamarg Alpine Cottage",
    description:
      "Stay close to the alpine landscapes of Sonamarg, surrounded by snow-covered mountains, green meadows, and beautiful Himalayan scenery.",
    image: {
      filename: "sonamarg-cottage",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049769/fOXi41RKQTpVO1OMN3YREXpqTTVtWmc8uIPPcC2SZsk8zFD1Z8dOvgotu7JrWMSvCgnlDpEepqRFvJQJD1IDtgqPCwAkrxaSsGMx1hl8TNFdabIUz07rey53LFYJGHbk-NdX6mUR5RxC51zQ5y0x1k5oTkTUWYN2neGB6sO99O6qrKB90PxgPE1TMpk0NNze.jpg"
    },
    price: 3000,
    location: "Sonamarg",
    country: "India",
    state: "Jammu and Kashmir",
    coordinates: {
      latitude: 34.302,
      longitude: 75.293,
    },
    geometry: {
      type: "Point",
      coordinates: [75.293, 34.302],
    },
  },


  // ============================================================
  // CHHATTISGARH - 4 LISTINGS
  // ============================================================

  {
    title: "Tribal Culture Homestay in Bastar",
    description:
      "Experience the rich tribal culture of Bastar from a welcoming local homestay. Discover traditional crafts, local cuisine, forests, and the region's unique cultural traditions.",
    image: {
      filename: "bastar-tribal-homestay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049789/44K7d_9APCtn-OASAFsF0jdaRfI1QJ1VToH-wj044W7xhCH7EbRQjCjQ1QuIosx4zEVf2JsfezBoHTuwtfWilNf55SfXPSmXYDD0vHlBakLcgvFzLyqmxzddjYyA1YcFrlMcJDcs6UtA4j2hPBrBcRH2Dq-KL61jdFlF_5_o3uPNLPw7vCTuafQXCNosJ6dy.jpg"
    },
    price: 1800,
    location: "Jagdalpur",
    country: "India",
    state: "Chhattisgarh",
    coordinates: {
      latitude: 19.0748,
      longitude: 82.008,
    },
    geometry: {
      type: "Point",
      coordinates: [82.008, 19.0748],
    },
  },

  {
    title: "Chitrakote Waterfall Retreat",
    description:
      "Stay near the spectacular Chitrakote Falls, often called the Niagara Falls of India. Enjoy forest surroundings, river views, and the natural beauty of Bastar.",
    image: {
      filename: "chitrakote-waterfall",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049794/hYU0TirZX-Nt-lEBP4p-VVlHqQXTcnNFPdzLxkxWG9kaY7Em7M84nFNJn8urQMQ3Ld2KlZSWS2n1FQmNqM_weyDtwDbFL_FsPAYTLq0bu8C8vMxg-4LuRjuyAQg6VHcWpYPO9lTl9hf3KPlcXxhmYSgXwGufgv5y1g52jF147-mxBs0q-X8QwoU_QadYibQH.jpg"
     },
    price: 2200,
    location: "Chitrakote",
    country: "India",
    state: "Chhattisgarh",
    coordinates: {
      latitude: 19.2046,
      longitude: 81.7014,
    },
    geometry: {
      type: "Point",
      coordinates: [81.7014, 19.2046],
    },
  },

  {
    title: "Barnawapara Forest Lodge",
    description:
      "Escape into the forests of central India with a peaceful lodge stay near Barnawapara Wildlife Sanctuary. Enjoy nature, wildlife, and quiet forest landscapes.",
    image: {
      filename: "barnawapara-forest-lodge",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049827/R9wAaPTHGO3X5XVUPYKoArbFBN5_d8sRXWMfXWKSH3GmoLggs5Vt0q3gvUthOyBj8yy885-ugoJ5lewfLaFAHDlO0dcYiyKLVAYWNdrKaxMjz0v2vg7opItFbaREhPoYpM_EvT3xWn-BnOzWTd3wU4y0nT3SSvLuKonNDyPkmTEHttOMIHA3rb8G9P0YNH2p.jpg"
     },
    price: 2500,
    location: "Barnawapara",
    country: "India",
    state: "Chhattisgarh",
    coordinates: {
      latitude: 21.15,
      longitude: 82.4,
    },
    geometry: {
      type: "Point",
      coordinates: [82.4, 21.15],
    },
  },

  {
    title: "Raipur Cultural City Stay",
    description:
      "Explore the cultural side of Chhattisgarh from a comfortable stay in Raipur. Visit museums, local markets, temples, and discover regional food and handicrafts.",
    image: {
      filename: "raipur-city-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049840/SmtzAqwUKiuYeqyg522WgGD3JkhgeJnkY4LMgs4rtC6JgvHfhuYy7vheEWr0BfSa3hfAtKo-r-olmqTUHk_dJGTOELszxj6bP70LSpZFDL01mbbTZ1kD7Q2T4tPqdQut_v1_ZBGPFxG7k-tOSQ4d2tcLsk1ivM8vyEN4AMeIytMsUKxAljMKbssMz0M17GnK.jpg"
     },
    price: 2000,
    location: "Raipur",
    country: "India",
    state: "Chhattisgarh",
    coordinates: {
      latitude: 21.2514,
      longitude: 81.6296,
    },
    geometry: {
      type: "Point",
      coordinates: [81.6296, 21.2514],
    },
  },


  // ============================================================
  // ANDHRA PRADESH - 4 LISTINGS
  // ============================================================

  {
    title: "Beachside Stay in Visakhapatnam",
    description:
      "Enjoy the Bay of Bengal from a comfortable coastal stay in Visakhapatnam. Explore beaches, viewpoints, seafood, and the city's vibrant coastal culture.",
    image: {
      filename: "vizag-beach-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049895/O4mJgOSyDnUBdM-oiQkvymkFMU1f4YwViNJ9DgTF-AE2sci4e30zgJnhn0lVizRMVMyQuIj5nA-0dPmnb_CuHVDOiFKqW5zkqXXGMbzJZ7aWYRWDRYemHuTuI-4hiPvp4BmqYdXza9CieTfTb9-B9OoJ0s72YHa-NpTQm7Ou_LIDpDh_sgWuuqUGhePFGjnX.jpg"
     },
    price: 2500,
    location: "Visakhapatnam",
    country: "India",
    state: "Andhra Pradesh",
    coordinates: {
      latitude: 17.6868,
      longitude: 83.2185,
    },
    geometry: {
      type: "Point",
      coordinates: [83.2185, 17.6868],
    },
  },

  {
    title: "Araku Valley Mountain Retreat",
    description:
      "Escape into the Eastern Ghats with a peaceful stay in Araku Valley. Enjoy coffee plantations, tribal culture, waterfalls, and beautiful mountain scenery.",
    image: {
      filename: "araku-valley-retreat",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049908/vcrQD-1y7LKomtNipqKFunnK3qfMPrxM3F9R8iSy--kNt0NHyFR4dTOL5I9n-o2dnxyrEXVGZRqZhqeNShMpIctwjbw5gWcdRwT9BCDWGbkK7kelZMIqqFEWMf52r2CaP7gZV0zQYOO4U838SJGtaX3T9OjqrCvncRYCkEj90PM90UhgxtY2UbziJtCtxA6c.jpg"
     },
    price: 2800,
    location: "Araku Valley",
    country: "India",
    state: "Andhra Pradesh",
    coordinates: {
      latitude: 18.3273,
      longitude: 82.8734,
    },
    geometry: {
      type: "Point",
      coordinates: [82.8734, 18.3273],
    },
  },

  {
    title: "Tirupati Pilgrimage Stay",
    description:
      "A comfortable stay in Tirupati for visitors exploring the famous Tirumala temple and the spiritual heritage of Andhra Pradesh.",
    image: {
      filename: "tirupati-stay",
      url: "https://res.cloudinary.com/tnd9uxmd/image/upload/v1789049917/c3YjlR7o9EgHJqjhNUpdWzkeh-4nWhmNVO4XjM1F-fl9dLspYz-8wjoxA5mxGjB_65C6aYWigpVnQINZPP-nGqGrYPvLRl1PecPrE6X4XtXeEFqsOVXJ2BCjE0-yCDgwVtg75znhwsoQKBSuuffSHwJvV9j3HlYFK_joBX4QosCmEeGfGkiXIG5ZpH4s_guF.jpg"
     },
    price: 2200,
    location: "Tirupati",
    country: "India",
    state: "Andhra Pradesh",
    coordinates: {
      latitude: 13.6288,
      longitude: 79.4192,
    },
    geometry: {
      type: "Point",
      coordinates: [79.4192, 13.6288],
    },
  },

  {
    title: "Heritage Stay in Amaravati",
    description:
      "Discover the historical and cultural heritage of Amaravati from a comfortable local stay. Explore ancient Buddhist heritage, temples, and the Krishna River region.",
    image: {
      filename: "amaravati-heritage-stay",
      url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    },
    price: 2100,
    location: "Amaravati",
    country: "India",
    state: "Andhra Pradesh",
    coordinates: {
      latitude: 16.573,
      longitude: 80.3575,
    },
    geometry: {
      type: "Point",
      coordinates: [80.3575, 16.573],
    },
  },
];

module.exports = { data: sampleListings };

// const sampleListings = [
//   {
//     title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//   },
//   {
//     title: "Modern Loft in Downtown",
//     description:
//       "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers!",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1200,
//     location: "New York City",
//     country: "United States",
//   },
//   {
//     title: "Mountain Retreat",
//     description:
//       "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1000,
//     location: "Aspen",
//     country: "United States",
//   },
//   {
//     title: "Historic Villa in Tuscany",
//     description:
//       "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2500,
//     location: "Florence",
//     country: "Italy",
//   },
//   {
//     title: "Secluded Treehouse Getaway",
//     description:
//       "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 800,
//     location: "Portland",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Paradise",
//     description:
//       "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2000,
//     location: "Cancun",
//     country: "Mexico",
//   },
//   {
//     title: "Rustic Cabin by the Lake",
//     description:
//       "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 900,
//     location: "Lake Tahoe",
//     country: "United States",
//   },
//   {
//     title: "Luxury Penthouse with City Views",
//     description:
//       "Indulge in luxury living with panoramic city views from this stunning penthouse apartment.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3500,
//     location: "Los Angeles",
//     country: "United States",
//   },
//   {
//     title: "Ski-In/Ski-Out Chalet",
//     description:
//       "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3000,
//     location: "Verbier",
//     country: "Switzerland",
//   },
//   {
//     title: "Safari Lodge in the Serengeti",
//     description:
//       "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 4000,
//     location: "Serengeti National Park",
//     country: "Tanzania",
//   },
//   {
//     title: "Historic Canal House",
//     description:
//       "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1800,
//     location: "Amsterdam",
//     country: "Netherlands",
//   },
//   {
//     title: "Private Island Retreat",
//     description:
//       "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 10000,
//     location: "Fiji",
//     country: "Fiji",
//   },
//   {
//     title: "Charming Cottage in the Cotswolds",
//     description:
//       "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1200,
//     location: "Cotswolds",
//     country: "United Kingdom",
//   },
//   {
//     title: "Historic Brownstone in Boston",
//     description:
//       "Step back in time in this elegant historic brownstone located in the heart of Boston.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2200,
//     location: "Boston",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Bungalow in Bali",
//     description:
//       "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1800,
//     location: "Bali",
//     country: "Indonesia",
//   },
//   {
//     title: "Mountain View Cabin in Banff",
//     description:
//       "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1500,
//     location: "Banff",
//     country: "Canada",
//   },
//   {
//     title: "Art Deco Apartment in Miami",
//     description:
//       "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach.",
//     image: {
//       filename: "listingimage",
//       url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1600,
//     location: "Miami",
//     country: "United States",
//   },
//   {
//     title: "Tropical Villa in Phuket",
//     description:
//       "Escape to a tropical paradise in this luxurious villa with a private infinity pool in Phuket.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1470165301023-58dab8118cc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 3000,
//     location: "Phuket",
//     country: "Thailand",
//   },
//   {
//     title: "Historic Castle in Scotland",
//     description:
//       "Live like royalty in this historic castle in the Scottish Highlands. Explore the rugged beauty of the area.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 4000,
//     location: "Scottish Highlands",
//     country: "United Kingdom",
//   },
//   {
//     title: "Desert Oasis in Dubai",
//     description:
//       "Experience luxury in the middle of the desert in this opulent oasis in Dubai with a private pool.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 5000,
//     location: "Dubai",
//     country: "United Arab Emirates",
//   },
//   {
//     title: "Rustic Log Cabin in Montana",
//     description:
//       "Unplug and unwind in this cozy log cabin surrounded by the natural beauty of Montana.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1100,
//     location: "Montana",
//     country: "United States",
//   },
//   {
//     title: "Beachfront Villa in Greece",
//     description:
//       "Enjoy the crystal-clear waters of the Mediterranean in this beautiful beachfront villa on a Greek island.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2500,
//     location: "Mykonos",
//     country: "Greece",
//   },
//   {
//     title: "Eco-Friendly Treehouse Retreat",
//     description:
//       "Stay in an eco-friendly treehouse nestled in the forest. It's the perfect escape for nature lovers.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 750,
//     location: "Costa Rica",
//     country: "Costa Rica",
//   },
//   {
//     title: "Historic Cottage in Charleston",
//     description:
//       "Experience the charm of historic Charleston in this beautifully restored cottage with a private garden.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1600,
//     location: "Charleston",
//     country: "United States",
//   },
//   {
//     title: "Modern Apartment in Tokyo",
//     description:
//       "Explore the vibrant city of Tokyo from this modern and centrally located apartment.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 2000,
//     location: "Tokyo",
//     country: "Japan",
//   },
//   {
//     title: "Lakefront Cabin in New Hampshire",
//     description:
//       "Spend your days by the lake in this cozy cabin in the scenic White Mountains of New Hampshire.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1200,
//     location: "New Hampshire",
//     country: "United States",
//   },
//   {
//     title: "Luxury Villa in the Maldives",
//     description:
//       "Indulge in luxury in this overwater villa in the Maldives with stunning views of the Indian Ocean.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 6000,
//     location: "Maldives",
//     country: "Maldives",
//   },
//   {
//     title: "Ski Chalet in Aspen",
//     description:
//       "Hit the slopes in style with this luxurious ski chalet in the world-famous Aspen ski resort.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 4000,
//     location: "Aspen",
//     country: "United States",
//   },
//   {
//     title: "Secluded Beach House in Costa Rica",
//     description:
//       "Escape to a secluded beach house on the Pacific coast of Costa Rica. Surf, relax, and unwind.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1800,
//     location: "Costa Rica",
//     country: "Costa Rica",
//   },
// ];

// module.exports = { data: sampleListings };