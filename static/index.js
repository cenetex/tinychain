$(()=>{
    function load_data (chain) {
        $.getJSON('chain.json', data => {
            console.log(data);
            let blocks_html = "";
            data.blocks.forEach(T => {
                let short_hash = T => T.substr(0,8);
                blocks_html += `<tr>
                    <td data-label="Hash">${short_hash(T.hash)}</td>
                    <td data-label="Date">${T.timestamp.substr(5,14)}</td>
                    <td data-label="Data">${short_hash(T.data)}</td>
                    <td data-label="Previous">${short_hash(T.previousHash)}</td>
                    <td data-label="Nonce">${T.nonce}</td>
                    </tr>`;
            });
            $('#chain_blocks').html( blocks_html);
        });
    }

    $('#create_button').on('click', () => {
        $.getJSON('wallet/new', data => {
            $("#wallet_id").val(data.address);
            $("#wallet_secret").val(data.secret);
        });
    });

    $('#sign_button').on('click', () => {
        $.post('wallet/sign', {
            source: $('#wallet_id').val(),
            destination: $('#destination').val(),
            amount: $('#amount').val(),
            key: $('#wallet_secret').val()
        }, data => {
            $('#transaction_data').val(data);
        });
    });

    $("#send_button").on('click', ()=> {
        $.post('transaction', JSON.parse($("#transaction_data").val()), data => {
            console.log(data);
        });
    });

    $("#mine_button").on('click', () => {
        $("#mine_button").hide();
        $("#mining").show();
        $.ajax({
            url: 'chain/mine',
            type: 'PUT',
            data: { address: $("#wallet_id").val() },
            success: function(response) {
                let s = $("#mine_ok");
                s.show();
                s.fadeOut(3000);

                $("#mine_button").show();
                $("#mining").hide();
                load_data();
            },
            error: function (error) {
                let s = $("#mine_fail");
                s.show();
                s.fadeOut(2000);

                $("#mine_button").show();
                $("#mining").hide();
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
    
    load_data();
});