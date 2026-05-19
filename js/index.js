fetch('products.xml')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "text/xml");
        const products = xml.getElementsByTagName("product");
        
        let html = '';
        for (let i = 0; i < Math.min(products.length, 4); i++) {
            const name = products[i].getElementsByTagName("name")[0].textContent;
            const price = products[i].getElementsByTagName("price")[0].textContent;
            const image = products[i].getElementsByTagName("image")[0].textContent;
            const organic = products[i].getElementsByTagName("organic")[0].textContent === 'true';
            
            html += `
                <div class="home-product-card">
                    <span class="organic-badge">${organic ? 'Новинка' : 'Свежее'}</span>
                    <div class="product-img-box">
                        <div class="product-img" style="background-image: url('img/${image}');"></div>
                    </div>
                    <h3>${name}</h3>
                    <p class="price">${price} BYN</p>
                    <button class="btn btn-card" onclick="addToCart('${name.replace(/'/g, "\\'")}', '${price}')">
                        В корзину
                    </button>
                </div>
            `;
        }
        document.getElementById('products-container').innerHTML = html;
    });