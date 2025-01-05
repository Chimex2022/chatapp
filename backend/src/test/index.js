package main

import (
    "encoding/json"
    "net/http"
    "sync"
    "golang.org/x/crypto/bcrypt"
)

type User struct {
    ID       string `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"` // In a real application, do not store passwords in plain text
}

type FoodItem struct {
    ID       string  `json:"id"`
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    FarmerID string  `json:"farmer_id"`
}

type Order struct {
    ID         string  `json:"id"`
    FoodID     string  `json:"food_id"`
    ConsumerID string  `json:"consumer_id"`
    Amount     float64 `json:"amount"`
}

var (
    users     = make(map[string]User)      // In-memory user storage
    foodItems = make(map[string]FoodItem)   // In-memory food item storage
    orders     = make(map[string]Order)      // In-memory order storage
    mu         sync.Mutex
)

// Sign-Up Endpoint
func signUp(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Hash the password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        http.Error(w, "Could not hash password", http.StatusInternalServerError)
        return
    }
    user.Password = string(hashedPassword)

    mu.Lock()
    users[user.Username] = user // Store user by username
    mu.Unlock()

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

// Login Endpoint
func login(w http.ResponseWriter, r *http.Request) {
    var user User
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    mu.Lock()
    storedUser, exists := users[user.Username]
    mu.Unlock()

    if !exists || bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password)) != nil {
        http.Error(w, "Invalid username or password", http.StatusUnauthorized)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode("Login successful")
}

// Upload Food Endpoint
func uploadFood(w http.ResponseWriter, r *http.Request) {
    var food FoodItem
    if err := json.NewDecoder(r.Body).Decode(&food); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Assuming the farmer ID is passed in the request header for authentication
    farmerID := r.Header.Get("Farmer-ID")
    if farmerID == "" {
        http.Error(w, "Farmer ID is required", http.StatusUnauthorized)
        return
    }
    food.FarmerID = farmerID

    mu.Lock()
    foodItems[food.ID] = food
    mu.Unlock()

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(food)
}

// Make Order Endpoint
func makeOrder(w http.ResponseWriter, r *http.Request) {
    var order Order
    if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Assuming the consumer ID is passed in the request header for authentication
    consumerID := r.Header.Get("Consumer-ID")
    if consumerID == "" {
        http.Error(w, "Consumer ID is required", http.StatusUnauthorized)
        return
    }
    order.ConsumerID = consumerID

    mu.Lock()
    orders[order.ID] = order
    mu.Unlock()

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(order)
}

func main() {
    http.HandleFunc("/sign-up", signUp)     // Sign-up endpoint
    http.HandleFunc("/login", login)         // Login endpoint
    http.HandleFunc("/upload-food", uploadFood) // Upload food endpoint
    http.HandleFunc("/make-order", makeOrder)   // Make order endpoint

    http.ListenAndServe(":8080", nil)
}