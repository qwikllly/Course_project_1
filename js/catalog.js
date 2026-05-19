let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("xml-container");
    if (!container) return;

    fetch('products.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const products = xml.getElementsByTagName("product");
            
            allProducts = [];
            for (let i = 0; i < products.length; i++) {
                const id = products[i].getElementsByTagName("id")[0]?.textContent || i;
                const name = products[i].getElementsByTagName("name")[0].textContent;
                const price = products[i].getElementsByTagName("price")[0].textContent;
                const category = products[i].getElementsByTagName("category")[0].textContent;
                const image = products[i].getElementsByTagName("image")[0].textContent;
                const organic = products[i].getElementsByTagName("organic")[0].textContent === 'true';
                
                allProducts.push({ id, name, price, category, image, organic });
            }
            
            renderProducts(allProducts);
            setupFilters();
            setupSearch();
            setupResetButton();
        })
        .catch(error => {
            console.error('Ошибка загрузки XML:', error);
            container.innerHTML = '<p>Ошибка загрузки товаров. Попробуйте позже.</p>';
        });
});

function renderProducts(products) {
    const container = document.getElementById("xml-container");
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Товары не найдены</p>';
        return;
    }
    
    let htmlContent = "";
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        htmlContent += `
            <div class="product-card" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                <div class="product-img-box">
                    <div class="product-img" style="background-image: url('img/${product.image}');"></div>
                </div>
                <h4>${product.name}</h4>
                <p class="price">${product.price} BYN</p>
                <button class="btn btn-card" onclick="addToCart('${product.name.replace(/'/g, "\\'")}', '${product.price}')">
                    В корзину
                </button>
            </div>
        `;
    }
    container.innerHTML = htmlContent;
}

function setupFilters() {
    const checkboxes = document.querySelectorAll('#category-list input[type="checkbox"]');
    if (!checkboxes.length) return;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            applyFiltersAndSearch();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        applyFiltersAndSearch();
    });
}

function applyFiltersAndSearch() {
    const selectedCategories = [];
    const checkboxes = document.querySelectorAll('#category-list input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });
    
    const searchText = document.getElementById('search')?.value.toLowerCase() || '';
    
    let filteredProducts = [...allProducts];
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    if (searchText) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchText)
        );
    }
    
    renderProducts(filteredProducts);
}

function setupResetButton() {
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#category-list input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            const searchInput = document.getElementById('search');
            if (searchInput) searchInput.value = '';
            applyFiltersAndSearch();
        });
    }
}