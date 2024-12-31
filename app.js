document.addEventListener('DOMContentLoaded', () => {
    function placeOrder() {
        // Get the form
        const form = document.getElementById('orderForm');
        if (!form) {
            console.error("The form with ID 'orderForm' was not found.");
            return;
        }

        // Get all checkboxes by name attribute
        const checkboxes = Array.from(form.querySelectorAll('input[name="item"]'));
        if (checkboxes.length === 0) {
            console.error("No checkboxes with the name 'item' found.");
            document.getElementById('result').innerHTML = "<p>No items selected.</p>";
            return;
        }

        // Get selected items
        const selectedItems = checkboxes.filter(input => input.checked).map(input => {
            const [name, price, weight] = input.value.split('-');
            return { name, price: parseFloat(price), weight: parseInt(weight) };
        });

    

        //group items
        let packages = [];
        let currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };

        selectedItems.forEach(item => {
            if (currentPackage.totalWeight + item.weight > 1000) {
                packages.push(currentPackage);
                currentPackage = { items: [], totalWeight: 0, totalPrice: 0 };
            }
            currentPackage.items.push(item.name);
            currentPackage.totalWeight += item.weight;
            currentPackage.totalPrice += item.price;
        });

        if (currentPackage.items.length > 0) {
            packages.push(currentPackage);
        }

        //calculate prices
        const courierPrices = packages.map(pkg => {
            if (pkg.totalWeight <= 200) return 5;
            if (pkg.totalWeight <= 500) return 10;
            if (pkg.totalWeight <= 1000) return 15;
            return 20;
        });

        //result
        let resultHTML = "<h2>This order has following packages:</h2>";
        packages.forEach((pkg, index) => {
            resultHTML += `<h3>Package ${index + 1}</h3>`;
            resultHTML += `<p>Items - ${pkg.items.join(', ')}</p>`;
            resultHTML += `<p>Total weight - ${pkg.totalWeight}g</p>`;
            resultHTML += `<p>Total price - $${pkg.totalPrice.toFixed(2)}</p>`;
            resultHTML += `<p>Courier price - $${courierPrices[index]}</p>`;
        });

        document.getElementById('result').innerHTML = resultHTML;
    }

    // Expose the function globally for button click
    window.placeOrder = placeOrder;
});
