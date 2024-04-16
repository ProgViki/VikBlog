export const getOrders = () => {
    return fetch("https://dummyjson.com/carts/1")
    .then(res => res.json())
    .then(console.log)
}

export const getRevenue = () => {
    return fetch("https://dummyjson.com/carts")
    .then(res => res.json())
    .then(console.log)
}
export const getInventory = () => {
    return fetch("https://dummyjson.com/products")
    .then(res => res.json())
    .then(console.log)
}
export const getCustomers = () => {
    return fetch("https://dummyjson.com/users")
    .then(res => res.json())
    .then(console.log)
}
export const getComments = () => {
    return fetch("https://dummyjson.com/comments")
    .then(res => res.json())
    .then(console.log)
}