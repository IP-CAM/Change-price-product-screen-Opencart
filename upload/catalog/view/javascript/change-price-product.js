function calculatePrice(options, currency, price, special) {
	const quantity = parseInt($("#product-quantity").val());

	const inputOptions = $(` #product .button-group-page input[type=\'text\'], 
                                #product .button-group-page input[type=\'hidden\'], 
                                #product .button-group-page input[type=\'radio\']:checked, 
                                #product .button-group-page input[type=\'checkbox\']:checked, 
                                #product .button-group-page select, 
                                #product .button-group-page textarea,
                                #product .product-options input[type=\'text\'], 
                                #product .product-options input[type=\'hidden\'], 
                                #product .product-options input[type=\'radio\']:checked, 
                                #product .product-options input[type=\'checkbox\']:checked, 
                                #product .product-options select, 
                                #product .product-options textarea`);

	if (inputOptions.length > 0) {
		inputOptions.each((index, input) => {
			const option = options.find((o) => `option[${o.product_option_id}]` === input.name);

			if (!option || !input.value) return;

			const optionValue = option.product_option_value.find(
				(o) => o.product_option_value_id === input.value
			);

			if (!optionValue) return;

			const optionPrice = parseFloat(
				optionValue.price_prefix + transformPriceInFloat(optionValue.price)
			);

			price = optionPrice + price;
			special = optionPrice + special;
		});
	}

	price = price * quantity;
	special = special * quantity;

	setValueInClass("product-price", formatPriceInBRL(price, currency));
	setValueInClass("product-price-old", formatPriceInBRL(price, currency));
	setValueInClass("product-price-new", formatPriceInBRL(special, currency));
}

function addChangeEvents(options, currency, price, special) {
	if (options && options.length > 0) {
		options.forEach((option) => {
			$(`[name="option[${option.product_option_id}]"]`).on("change", () => calculatePrice(options, currency, price, special));
		});
	}

	$("#product-quantity").on("change", () => calculatePrice(options, currency, price, special));
}

function transformPriceInFloat(price) {
	if (!price) return 0;

	return Number(price.replace(/[^0-9-]/g, "")) / 10 ** 2;
}

function formatPriceInBRL(price, currency) {
	return price.toLocaleString("pt-br", { style: "currency", currency: currency });
}

function setValueInClass(classSelector, value) {
	const element = $(`.${classSelector}`);

	if (!!element) element.html(value);	
}
