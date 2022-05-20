$(function () {
    // tooltip
    $('[data-bs-toggle="tooltip"]').tooltip()
    // datetime
    function dateTimeHandle() {
        var today = new Date()
        var temp = today.toDateString()
        temp = temp.split(' ')
        var date = temp[0] + ', ' + temp[1] + ' ' + temp[2] + ', ' + temp[3]
        var time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds()
        $('#date').text(date)
        $('#time').text(time)
    }
    dateTimeHandle()
    setInterval(dateTimeHandle, 1000)
    // Chart

    let gridColor = '#5b5b5b'

    const chart1 = document.querySelector('#chart1').getContext('2d')
    const chart2 = document.querySelector('#chart2').getContext('2d')
    const chart3 = document.querySelector('#chart3').getContext('2d')
    const chart4 = document.querySelector('#chart4').getContext('2d')


    function createChart(chart, type, opt) {
        new Chart(chart, {
            type: type,
            data: opt.data,
            options: opt.opt
        })
    }

    function pieOpt(label, bgColor, quantity, title) {
        const data = {
            labels: label,
            datasets: [{
                backgroundColor: bgColor,
                borderColor: '#26292f',
                hoverOffset: 6,
                data: quantity
            }]
        }
        const opt = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                }
            },

        }
        return {
            data: data,
            opt: opt
        }
    }

    function lineOpt(label, bgColor, quantity, title) {
        const data = {
            labels: label,
            datasets: [{
                    label: 'Deposit',
                    backgroundColor: bgColor[0],
                    borderColor: bgColor[0],
                    data: quantity.deposit
                },
                {
                    label: 'Withdraw',
                    backgroundColor: bgColor[1],
                    borderColor: bgColor[1],
                    data: quantity.withdraw
                },
                {
                    label: 'Transfer',
                    backgroundColor: bgColor[2],
                    borderColor: bgColor[2],
                    data: quantity.transfer
                },
                {
                    label: 'Top-up Card',
                    backgroundColor: bgColor[3],
                    borderColor: bgColor[3],
                    data: quantity.card
                }
            ]
        }
        const opt = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    display: true,
                    title: {
                        display: true,
                        text: 'Value'
                    },
                    suggestedMin: 0,
                    suggestedMax: 1000
                }
            }
        }
        return {
            data: data,
            opt: opt
        }
    }

    const pie1_legend = ['Income', 'Spending']
    const pie1_bg = ['#4b961c', '#ff084a']
    const pie1_title = 'Today Income/Spending Scale'

    const pie2_legend = ['Deposit', 'Withdraw', 'Transfer', 'Top-up Card']
    const pie2_bg = ['#4b961c', '#ff084a', '#03396c', '#ffbf00']
    const pie2_title = 'Today Transaction Scale'

    const line1_legend = ['', '', '', '', '', '', '']
    const line1_bg = pie2_bg
    const line1_title = 'Transition Scale in recent days'

    const pie3_legend = pie1_legend
    const pie3_bg = pie1_bg
    const pie3_title = 'Income/Spending Scale in recent days'

    const deposit = [220, 237, 808, 308, 168, 937, 429]
    const withdraw = [325, 42, 146, 617, 371, 290, 872]
    const transfer = [730, 113, 545, 323, 160, 379, 498]
    const card = [920, 712, 911, 700, 70, 672, 433]

    createChart(chart1, 'doughnut', pieOpt(pie1_legend, pie1_bg, [40, 60], pie1_title))
    createChart(chart2, 'doughnut', pieOpt(pie2_legend, pie2_bg, [20, 30, 40, 10], pie2_title))
    createChart(chart3, 'line', lineOpt(line1_legend, line1_bg, {
        deposit,
        withdraw,
        transfer,
        card
    }, line1_title))
    createChart(chart4, 'doughnut', pieOpt(pie3_legend, pie3_bg, [60, 40], pie3_title))

    // sidebar handle

    let currShow = 'home'

    function showSection(btn, section) {
        $('#' + section.replace(' ', '-').toLowerCase()).fadeIn()
        $('#section-name').text(section)
        $('#section-expand').text('')
        $('#' + currShow + '-btn > i').removeClass('icon-active')
        if(section == 'History' || section == 'Dashboard' || section == 'Your Account') $('#home-btn>i').removeClass('icon-active')
        btn.children().addClass('icon-active')
        currShow = section.replace(' ', '-').toLowerCase()
    }

    $('#home-btn').click(function () {
        $('#' + currShow).fadeOut(200, function () {
            showSection($('#home-btn'), 'Home')
        })
    })

    $('#history-btn').click(function () {
        $('#' + currShow).fadeOut(200, function () {
            showSection($('#history-btn'), 'History')
        })
    })

    $('#dashboard-btn').click(function () {
        $('#' + currShow).fadeOut(200, function () {
            showSection($('#dashboard-btn'), 'Dashboard')
        })
    })

    $('#your-account-btn').click(function () {
        $('#' + currShow).fadeOut(200, function () {
            showSection($('#your-account-btn'), 'Your Account')
        })
    })

    // show/hide balance

    let flagBalance = true
    let balance = $('#balance').text()
    balanceHandle()

    function balanceHandle() {
        if (flagBalance) {
            $('#balance').text('*'.repeat(balance.length))
            $('.show-balance').addClass('fa-eye')
            $('.show-balance').removeClass('fa-eye-slash')
        } else {
            $('#balance').text(balance)
            $('.show-balance').addClass('fa-eye-slash')
            $('.show-balance').removeClass('fa-eye')
        }
    }

    $('.show-balance').click(function () {
        balanceHandle()
        flagBalance = !flagBalance
    })

    // history and lasted transaction handle 

    const histories = [
        {name: 'deposit', status: 'success', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'transfer', status: 'fail', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
        {name: 'withdraw', status: 'waiting', time: '00/00/0000', balance: 0.0, amount: 0.0},
    ]

    function updateHistory() {

        $.ajax({
            url: '',

        })

        $('#history-list').html('')

        histories.forEach((history,index) => {
            let icon = ''
            let statusColor = ''
    
            if(history.name == 'deposit'){
                icon = 'fa-arrow-right-to-bracket deposit-icon'
            }else if(history.name == 'withdraw'){
                icon = 'fa-dollar-sign withdraw-icon'
            }else if (history.name == 'transfer'){
                icon = 'fa-money-bill-transfer transfer-icon'
            }else{
                icon = 'fa-mobile-screen topUp-card-icon'
            }
    
            if(history.status == 'success'){
                statusColor = 'var(--green-color);'
            }else if (history.status == 'waiting'){
                statusColor = 'var(--blue-input-color);'
            }else{
                statusColor = 'var(--red-color);'
            }
    
            $('#history-list').append(
                `<tr>`
                    + `<td class="d-flex align-items-center">`
                        + `<i`
                            + ` class="fa-solid ${icon} transaction-icon me-3"></i>`
                            + `${history.name}`
                    + `</td>`
                    + `<td style="color: ${statusColor}">${history.status}</td>`
                    + `<td>${history.time}</td>`
                    + `<td class="balance-history">${history.balance}đ</td>`
                    + `<td>$${history.amount}</td>`
                + `</tr>`
            )
    
            if(index < 6){
                $('.transaction-list').append(
                    `<li class="transaction-item">`
                        + `<i class="fa-solid ${icon} transaction-icon"></i>`
                        + `<div>${history.name}</div>`
                        + `<div>${history.amount}đ</div>`
                    + `</li>`
                )
            }
        })
    }

    updateHistory()

    //section name handle

    function showHome() {
        $('#home').fadeIn()
        currShow = 'home'
    }

    function hideSection() {
        if ($('#section-expand').text() != '') {
            $('#' + currShow).fadeOut(200, function (){
                showHome()
            })
            $('#section-expand').text('')
        }
    }

    $('#section-name').click(function () {
        hideSection()
        resetMes()
    })

    function showFunction(name) {
        $('#section-expand').text(' > ' + name)
        $('#home').fadeOut(200,function(){
            if(name == 'Deposit'){
                $('#deposit-function').fadeIn()
                currShow = 'deposit-function'
            }else if (name == 'Withdraw'){
                $('#withdraw-function').fadeIn()
                currShow = 'withdraw-function'
            }else if (name == 'Transfer'){
                $('#transfer-function').fadeIn()
                currShow = 'transfer-function'
            }else{
                $('#card-function').fadeIn()
                currShow = 'card-function'
            }
        })
    }

    // deposit handle

    $('#deposit').click(function () {
        showFunction('Deposit')
    })

    // withdraw handle

    $('#withdraw').click(function () {
        showFunction('Withdraw')
    })

    // transfer handle

    $('#transfer').click(function () {
        showFunction('Transfer')
    })

    // deposit handle

    $('#topUp-card').click(function () {
        showFunction('Top-up Card')
    })

    // user info

    userInfo = {
        status: 'no verified',
        name: 'User Name',
        birthday: '02/05/2002',
        phone: '0123456789',
        email: 'user@gmail.com',
        address: 'Tp. Hồ Chí Minh',
        password: '123456789'
    }

    if (userInfo.status == 'verified') {
        $('#status-icon').removeClass('fa-circle-exclamation')
        $('#status-icon').addClass('fa-circle-check')
        $('#status-icon').css('color', 'var(--green-color)')
        $('#your-account-btn').on('click')
        $('#update-btn').hide()
    } else if (userInfo.status == 'not verified') {
        $('#your-account-btn').off('click')
    } else {
        $('#status-icon').removeClass('fa-circle-check')
        $('#status-icon').addClass('fa-circle-exclamation')
        $('#status-icon').css('color', 'var(--red-color)')
        $('#your-account-btn').on('click')
        $('#update-btn').show()
    }

    $('#name').text(userInfo.name)
    $('#birthday').text(userInfo.birthday)
    $('#phone-number').text(userInfo.phone)
    $('#email').text(userInfo.email)
    $('#address').text(userInfo.address)
    $('#password').html('*'.repeat(userInfo.password.length)
        + '<button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#change-password-modal">' 
        + '<i class="fa-solid fa-lock me-2"></i>Change Password</button>')

    // change password handle

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    let currPass = ''
    let newPass = ''
    let confirmPass = ''

    function resetInput() {
        $('#input-current-password').val('')
        $('#input-new-password').val('')
        $('#input-confirm-password').val()
    }

    function validateNewPass() {
        if(!passwordRegex.test(newPass)){
            $('#new-pass-mes').text('Must contain at lest 6 characters, one letter and one number')
            resetInput()
        }
        if(newPass != confirmPass){
            $('#confirm-pass-mes').text('Incorrect confirm password')
            resetInput()
        }
        if(currPass != userInfo.password){
            $('#current-pass-mes').text('Incorrect password')
            $('#new-pass-mes').text('')
            $('#confirm-pass-mes').text('')
            resetInput()
        }
    }

    $('#input-current-password').change(function() {
        currPass = $(this).val()
    })

    $('#input-new-password').change(function() {
        newPass = $(this).val()
    })

    $('#input-confirm-password').change(function() {
        confirmPass = $(this).val()
    })

    $('#reset-pass-btn').click(function (){
        validateNewPass()
    })

    $('#close-pass-form').click(function (){
        $('#current-pass-mes').text('')
        $('#new-pass-mes').text('')
        $('#confirm-pass-mes').text('')
    })

    // avatar opt

    $('#avatar-account').click(function (){
        $('#' + currShow).fadeOut(200, function () {
            showSection($('#your-account-btn'), 'Your Account')
        })
    })

    // message handle

    function resetMes() {
        $('#deposit-card-number-mes').text('')
        $('#deposit-expiration-date-mes').text('')
        $('#deposit-cvv-mes').text('')
        $('#deposit-amount-mes').text('')
    }

    function showMes(message, type){
        if(type == 'success'){
            $('#mes').css('backgroundColor','#4b961c')
        }else{
            $('#mes').css('backgroundColor','#ff084a')
        }
        $('#message').text(message)
        $('#mes').toast('show')
    }

    // deposit function handle

    $('.close-btn').click(function (){
        hideSection()
        resetMes()
    })

    function validateCardInfo(number, date, cvv, amount){

        amount = Number(amount)
        const numberOnly = /^[0-9]{6,}$/
        const cvvNumber = /^[0-9]{3,}$/
        let flagCardInfo = true

        if(!numberOnly.test(number)){
            $('#deposit-card-number-mes').text('Card number must contain 6 number')
            flagCardInfo = false
        }else{
            $('#deposit-card-number-mes').text('')
        }
        if(date == ''){
            $('#deposit-expiration-date-mes').text('Please enter expiration date')
        }else{
            $('#deposit-expiration-date-mes').text('')
        }
        if(!cvvNumber.test(cvv)){
            $('#deposit-cvv-mes').text('CVV code must contain 3 number')
            flagCardInfo = false
        }else{
            $('#deposit-cvv-mes').text('')
        }
        if(amount <= 0 || Number.isNaN(amount) || !Number.isInteger(amount)){
            $('#deposit-amount-mes').text('Invalid amount')
            flagCardInfo = false
        }else{
            $('#deposit-amount-mes').text('')
        }
        return flagCardInfo
    }

    $('#deposit-btn').click(function (){
        const cardNumber = $('#deposit-card-number').val()
        const expirationDate = $('#deposit-expiration-date').val()
        const cvvCode = $('#deposit-cvv-code').val()
        const depositAmount = $('#deposit-amount').val()
        if(validateCardInfo(cardNumber,expirationDate,cvvCode,depositAmount)){
            $.ajax({
                url: '',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: email,
                    cardnumber: cardNumber,
                    expdate: expirationDate,
                    cvv: cvvCode,
                    amount: depositAmount
                }
            })
            .done(function(data){
                updateHistory()
                showMes(data.data, 'success')
            })
            .fail(function(data){
                showMes(data.data, 'error')
            })
        }
    })
})