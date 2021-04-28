window.onload = function () {
    var bitclout_price = 150
    var get_bitclout_price_api = 'https://api.cloutcompare.com/bitclout/price'

    function get_token_price(data) {
        data = JSON.parse(data)
        let bitclout_price = data.data.bitclout_price.bitclout_bitcoin_exchange_rate * data.data.bitclout_price.bitcoin_usd_exchange_rate
        $('#price').html('' + bitclout_price.toLocaleString());
        return bitclout_price;
    }

    function to_float(num) {
        return parseFloat(num)
    }

    function main() {
        $('#current_token_price').on('keyup', (e) => {
            e.stopPropagation();
            e.preventDefault()
            target = e.target;
            action = target.dataset.attrValue;
            var current_token_price = to_float($('#current_token_price').val() || '0'), coins_supply = 0,
                market_cap = 0;
            if (current_token_price > 0) {
                coins_supply = (10 * Math.sqrt(10 / 3) * Math.sqrt(current_token_price)) / (Math.sqrt(bitclout_price));
                market_cap = current_token_price * coins_supply;
                $('.market_cap').val(market_cap.toFixed(3));
                $('#coins_in_circulation').val(coins_supply.toFixed(3));
            }
        })

        $('#coins_in_circulation').on('keyup', (e) => {
            e.stopPropagation();
            e.preventDefault()
            target = e.target;
            action = target.dataset.attrValue;
            var current_token_price = 0, coins_supply = to_float($('#coins_in_circulation').val() || '0'), market_cap = 0;
            market_cap = Math.pow(-((-current_token_price / bitclout_price)) / (0.003 * 0.3333), 0.3333);
            if (coins_supply > 0) {
                current_token_price = Math.pow(coins_supply * Math.sqrt(bitclout_price) / 10 * Math.sqrt(0.3333), 2);
                market_cap = current_token_price * coins_supply;
                $('.market_cap').val(market_cap.toFixed(3));
                $('#current_token_price').val(current_token_price.toFixed(3));
            }
        })
        $(document).ready(function () {
            $('.trade-creator-coin-info-sell').hide();
        })
        $("#trade").on('click', (e) => {
            if ($("#trade").val() == 'buy') {
                $('.trade-creator-coin-info-sell').hide();
                $('.trade-creator-coin-info-buy').show();
                $('.simple-label-usd').text('usd to capture from buying')
                ('.trade-creator-coin-info-sell').hide();
            } else
                $('.trade-creator-coin-info-buy').hide();
            $('.trade-creator-coin-info-sell').show();
            $('.simple-label-usd').text('usd to capture from sale')
        });
        $(".calculate-button").on('click', (e) => {
            if ($("#current_token_price").val() <= 0) {
                alert("Check fields 'Сurrent Coin Price' or 'Coins In Circulation' ");
            } else if ($("#amountTraded").val() <= 0) {
                alert("Check field 'usd to capture from buying/sale'");
            } else {
                if ($("#trade").val() == 'buy') {
                    if ($('.founder-reward').val() > 0) {
                        var  coins_supply = to_float($('#coins_in_circulation').val());
                        $('.info-founder-reward').text("The creator will receive - " + coins_supply * ($('.founder-reward').val())/100 + ' Coins' );
                    }
                        var current_token_price = to_float($('#current_token_price').val()),
                            coins_supply = to_float($('#coins_in_circulation').val() || '0'),
                            usd_locked = (0.001 * coins_supply ** 3) * bitclout_price;
                        var usd_to_buy = to_float($("#amountTraded").val());
                        let expected_usd_locked = usd_locked + usd_to_buy;
                        let expected_coins_supply = (10 * Math.pow(expected_usd_locked, 1 / 3)) / Math.pow(bitclout_price, 1 / 3);
                        let expected_token_price = 0.003 * Math.pow(expected_coins_supply, 2) * bitclout_price;
                        var expected_market_cap = expected_token_price * expected_coins_supply;
                        var market_cap = to_float($('.market_cap').val());


                        $('.creator-coin-price-change .f-s-16px').html('$' + current_token_price + '<i class="fad fa-long-arrow-right" aria-hidden="true"></i> <span\n' +
                            '                            style="color:#138E5B"> $' + expected_token_price.toFixed(3) + '</span>' +
                            '<div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-down" style="color: #138E5B" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray">$ ' + ((expected_token_price - current_token_price) / current_token_price * 100).toFixed(3) + '%</span>');

                        $('.creator-coin-circulation-change .f-s-16px').html(coins_supply.toFixed(3) + ' <i class="fad fa-long-arrow-right" aria-hidden="true"></i> <span\n' +
                            '                                style="color:#138E5B"> ' + expected_coins_supply.toFixed(3) + '</span><div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-down" style="color: #138E5B" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray">' + ((expected_coins_supply - coins_supply) / coins_supply * 100).toFixed(3) + '%</span>');

                        $('.market-cap-change-buying .f-s-16px').html('$' + market_cap +
                            ' <i class="fad fa-long-arrow-right" aria-hidden="true"></i>' +
                            '<span style="color:#138E5B"> $' + expected_market_cap.toFixed(3) + ' </span>' +
                            '<div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-down" style="color: #138E5B" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray">' + ((expected_market_cap - market_cap) / market_cap * 100).toFixed(3) +
                            '% </span>');

                } else if ($("#trade").val() == 'sell') {
                    var current_token_price = to_float($('#current_token_price').val()),
                        coins_supply = to_float($('#coins_in_circulation').val() || '0'),
                        usd_locked = (0.001 * coins_supply ** 3) * bitclout_price;
                    var usd_to_buy = to_float($("#amountTraded").val());
                    let expected_usd_locked = usd_locked - usd_to_buy;
                    let expected_coins_supply = (10 * Math.pow(expected_usd_locked, 1 / 3)) / Math.pow(bitclout_price, 1 / 3);
                    let expected_token_price = 0.003 * Math.pow(expected_coins_supply, 2) * bitclout_price;
                    var expected_market_cap = expected_token_price * expected_coins_supply;
                    var market_cap = to_float($('.market_cap').val());
                    if (expected_usd_locked < 0) {
                        alert("you want to sell more than you have");
                    } else {
                        $('.creator-coin-price-change-sell .f-s-16px').html('$' + current_token_price.toFixed(3) + '<i class="fad fa-long-arrow-right" aria-hidden="true"></i> <span\n' +
                            '                                style="color:#F77F0E"> $' + expected_token_price.toFixed(3) + '</span><div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-up" style="color: #F77F0E" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray">' + ((current_token_price - expected_token_price) / current_token_price * 100).toFixed(3) + '%</span>');
                        $('.creator-coin-circulation-change-sell .f-s-16px').html(coins_supply + '<i class="fad fa-long-arrow-right" aria-hidden="true"></i> <span\n' +
                            '                                style="color:#F77F0E"> ' + expected_coins_supply.toFixed(3) + '</span><div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-up" style="color: #F77F0E" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray"> ' + ((coins_supply - expected_coins_supply) / coins_supply * 100).toFixed(3) + '%');
                        $('.market-cap-change-sale .f-s-16px').html(market_cap.toFixed(3) + '<i class="fad fa-long-arrow-right" aria-hidden="true"></i> <span\n' +
                            '                                style="color:#F77F0E"> $' + expected_market_cap.toFixed(3) + '</span><div class="f-s-12px m-t-10px">\n' +
                            '                                <i class="fad fa-arrow-alt-up" style="color: #F77F0E" aria-hidden="true"></i> <span\n' +
                            '                                    class="color-gray">' + ((market_cap - expected_market_cap) / market_cap * 100).toFixed(3) + '%</span>');


                    }

                }
            }

        });

    }

    fetch(get_bitclout_price_api).then(function (response, body) {
        response.text().then((data) => {
            bitclout_price = get_token_price(data)
            setInterval(() => {
                fetch(get_bitclout_price_api).then(function (response, body) {
                    response.text().then((data) => {
                        get_bitclout_price_api = get_token_price(data)
                    });
                });
            }, 10000)
            main();
        })
    }).catch((error) => {
        $('#price').html('' + bitclout_price);
        main();
        console.log('Current price doesn\'t find');
    });
}