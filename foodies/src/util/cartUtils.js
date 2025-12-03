export const calculateCartTotals = (cartItems, quantities) => {
    const hasBiryani = cartItems.some(food => {
        const name = food.name ? food.name.toLowerCase() : '';
        const category = food.category || '';
        return name.includes('biryani') || category.toLowerCase() === 'biryani';
    });
    
    
    const cokeItem = cartItems.find(food => {
        const name = food.name ? food.name.toLowerCase() : '';
        const category = food.category || '';
        return name === 'coke' || name === 'coca cola' || name === 'cola' || category.toLowerCase() === 'coke';
    });
    
    const subtotal = cartItems.reduce((acc, food) => {
        let price = food.price;
        
        
        if (hasBiryani && cokeItem && food.id === cokeItem.id) {
            price = 0; // Free coke when biryani is present
        }
        
        return acc + price * quantities[food.id];
    }, 0);
    
    const shipping = subtotal === 0 ? 0.0 : 10;
    const tax = subtotal * 0.1; //10%
    const total = subtotal + shipping + tax;

    return {subtotal, shipping, tax, total};
}