$(()=>{
    function load_data (chain) {
        $.getJSON(`/chains/${chain}`, data => {
            console.log(data);
            var chain_div = $('#chain_name');
            chain_div.html(
                `Chain Name: ${data.blocks[0].data} (${data.blocks.length})`
            );
            let blocks_html = "";
            data.blocks.forEach(T => {
                let short_hash = T => T.substr(0,8);
                blocks_html += `<tr>
                    <td>${short_hash(T.hash)}</td>
                    <td>${short_hash(T.timestamp)}</td>
                    <td>${short_hash(T.data)}</td>
                    <td>${short_hash(T.previousHash)}</td>
                    <td>${T.nonce}</td>
                    </tr>`
            });
            $('#chain_blocks').html( blocks_html);
        });
    }

    $('#create_wallet').on('click', () => {
        $.getJSON('wallet/new', data => {
            $("#wallet_id").val(data.address);
            $("#wallet_key").val(data.secret);
        })
    });

    $('#sign_transaction').on('click', () => {
        $.post('wallet/sign', {
            source: $('#wallet_id').val(),
            destination: $('#destination').val(),
            amount: $('#amount').val(),
            key: $('#wallet_key').val()
        }, data => {
            $('#transaction_data').val(data);
        });
    });

    $("#send").on('click', ()=> {
        $.post('transaction', JSON.parse($("#transaction_data").val()), data => {
            console.log(data);
        });
    });

    $('#test_chain').on('click', () => {
        load_data("test");
    });

    $("#mine_button").on('click', () => {
        $.ajax({
            url: 'chain/mine',
            type: 'PUT',
            data: { address: $("#wallet_key").val() },
            success: function(response) {
                console.log(response);
            }
         });
    });
    $("#save_button").on('click', () => {
        $.ajax({
            url: 'chain/save',
            type: 'PUT',
            success: function(response) {
                console.log(response);
            }
         });
    });
    
    load_data("test");
});