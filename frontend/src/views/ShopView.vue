<template>
    <div class="shop-container">
      <header class="shop-header">
        <h1 class="shop-title">Магазин</h1>
        <div class="user-coins">
          <img src="@/assets/coin-icon.png" alt="Coins" class="coin-icon" />
          <span>{{ userCoins }}</span>
        </div>
      </header>
  
      <nav class="categories">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="{ active: selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </nav>
  
      <div class="products">
        <div
          class="product-card"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <img
            :src="product.image"
            alt="Product"
            class="product-image"
          />
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-footer">
            <div class="product-price">
              <img src="@/assets/coin-icon.png" alt="Coins" class="coin-icon" />
              <span>{{ product.price }}</span>
            </div>
            <button
              class="buy-button"
              :disabled="userCoins < product.price"
              @click="buyProduct(product)"
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import profileImage from '@/assets/profile.png'
  export default {
    data() {
      return {
        userCoins: 100, // Текущее количество монет пользователя
        selectedCategory: null,
        categories: [
          { id: 1, name: "Категория 1" },
          { id: 2, name: "Категория 2" },
          { id: 3, name: "Категория 3" },
          { id: 4, name: "Категория 4" },
          { id: 5, name: "Категория 5" },
        ],
        products: [
          { id: 1, name: "Товар 1", price: 10, image: profileImage, category: 1 },
          { id: 2, name: "Товар 2", price: 20, image: profileImage, category: 1 },
          { id: 3, name: "Товар 3", price: 15, image: profileImage, category: 2 },
          { id: 4, name: "Товар 4", price: 25, image: profileImage, category: 3 },
        ],
      };
    },
    computed: {
      filteredProducts() {
        return this.selectedCategory
          ? this.products.filter(
              (product) => product.category === this.selectedCategory
            )
          : this.products;
      },
    },
    methods: {
      selectCategory(categoryId) {
        this.selectedCategory = categoryId;
      },
      buyProduct(product) {
        if (this.userCoins >= product.price) {
          this.userCoins -= product.price;
          alert(`Вы купили ${product.name}!`);
        } else {
          alert("Недостаточно монет!");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .shop-container {
    padding: 20px;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: white;
    background: linear-gradient(180deg, #4a90e2, #003f7f);
    overflow-x: hidden;
  }
  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .shop-title {
    font-size: 24px;
  }
  .user-coins {
    display: flex;
    align-items: center;
  }
  .coin-icon {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  .categories {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .categories button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
  .categories button.active {
    background-color: #3b82f6;
  }
  .categories button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .products {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  .product-card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 15px;
    text-align: center;
  }
  .product-image {
    width: 100%;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .product-name {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .product-price {
    display: flex;
    align-items: center;
  }
  .buy-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
  }
  .buy-button:disabled {
    background-color: #3b82f6;
    cursor: not-allowed;
  }
  /* Обновлённый медиа-запрос для мобильных устройств */
  @media (max-width: 600px) {
    .products {
      grid-template-columns: repeat(2, 1fr);
    }
    .categories {
      flex-wrap: nowrap;
      overflow-x: auto;
      white-space: nowrap;
    }
    .categories::-webkit-scrollbar {
      display: none; /* scrollbar скрыт */
    }
    .categories {
      scrollbar-width: none; /* scrollbar скрыт для Firefox */
    }
  }
  </style>