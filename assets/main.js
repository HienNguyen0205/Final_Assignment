$(function () {
    // tooltip
    $('[data-bs-toggle="tooltip"]').tooltip()
    // datetime

    const today = new Date()
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    let week = []

    Date.prototype.toDateInputValue = (function() {
        var local = new Date(this)
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0,10);
    })

    for(let i=0;i < 7;i++){
        let day = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        day = day.toString().split(' ')
        week.unshift(day[3]+'-'+ ((months.indexOf(day[1])+1) < 10 ? '0' + String(months.indexOf(day[1])+1) : months.indexOf(day[1])+1) + '-'+day[2])
    }

    $('#deposit-expiration-date').val(today.toDateInputValue())
    $('#withdraw-expiration-date').val(today.toDateInputValue())

    function dateTimeHandle() {
        const today = new Date()
        let temp = today.toDateString()
        temp = temp.split(' ')
        const date = temp[0] + ', ' + temp[1] + ' ' + temp[2] + ', ' + temp[3]
        const time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes() + ":" + (today.getSeconds() < 10 ? '0' : '') + today.getSeconds()
        $('#date').text(date)
        $('#time').text(time)
    }
    dateTimeHandle()
    setInterval(dateTimeHandle, 1000)

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

    let histories = []

    function slitDate(str){
        const result = str.split(' ')
        return result[0]
    }

    
    const weekDeposit = [0,0,0,0,0,0,0]
    const weekWithdraw = [0,0,0,0,0,0,0]
    const weekTransfer = [0,0,0,0,0,0,0]
    const weekCard = [0,0,0,0,0,0,0]
    const todayTransaction = [0,0,0,0]
    const todayHis = [0,0]
    const weekHis = [0,0]

    const email = "binhnguyenxuan47@gmail.com"

    function updateHistory() {

        $.ajax({
            url: 'http://localhost/php_webvidientu-main/api/gettrans.php',
            type: 'POST',
            async: false,
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email
            })
        })
        .done(function(data){
            histories = data.data
        })
        .fail(function(data){
            showMes(data.data, 'error')
        })

        $('#history-list').html('')

        histories.forEach((history,index) => {
            let icon = ''
            let statusColor = ''
            let status = ''
    
            if(history.transtype == 'deposit'){
                icon = 'fa-arrow-right-to-bracket deposit-icon'
            }else if(history.transtype == 'withdraw'){
                icon = 'fa-dollar-sign withdraw-icon'
            }else if (history.transtype == 'transfer'){
                icon = 'fa-money-bill-transfer transfer-icon'
            }else{
                icon = 'fa-mobile-screen topUp-card-icon'
            }
    
            if(history.approval == '1'){
                status = 'success'
                statusColor = 'var(--green-color);'
            }else if (history.approval == '0'){
                status = 'waiting'
                statusColor = 'var(--blue-input-color);'
            }else{
                status = 'fail'
                statusColor = 'var(--red-color);'
            }
    
            $('#history-list').append(
                `<tr>`
                    + `<td class="d-flex align-items-center">`
                        + `<i`
                            + ` class="fa-solid ${icon} transaction-icon me-3"></i>`
                            + `${history.transtype}`
                    + `</td>`
                    + `<td style="color: ${statusColor}">${status}</td>`
                    + `<td>${history.datetrans}</td>`
                    + `<td>$${history.amount}</td>`
                + `</tr>`
            )
    
            if(index < 6){
                $('.transaction-list').append(
                    `<li class="transaction-item">`
                        + `<i class="fa-solid ${icon} transaction-icon"></i>`
                        + `<div>${history.transtype}</div>`
                        + `<div>${history.amount}đ</div>`
                    + `</li>`
                )
            }

            const time = slitDate(history.datetrans)
            if(week.includes(time) && status == 'success'){
                const amount = Number(history.amount)
                const weekIndex = week.indexOf(time)
                if(history.transtype == 'deposit'){
                    weekDeposit[weekIndex] += amount
                }else if(history.transtype == 'withdraw'){
                    console.log('lol')
                    weekWithdraw[weekIndex] += amount
                }else if(history.transtype == 'transfer'){
                    weekTransfer[weekIndex] += amount
                }else{
                    weekCard[weekIndex] += amount
                }
                console.log(weekWithdraw)
            }
            updateChart()
            console.log()
        })
    }

    updateHistory()

    // update chart

    function updateChart() {
        for(let i=0;i<7;i++){
            weekHis[0] += weekDeposit[i]
            weekHis[1] += weekWithdraw[i] + weekTransfer[i] + weekCard[i]
        }
        todayHis[0] = weekDeposit[6]
        todayHis[1] = weekWithdraw[6] + weekTransfer[6] + weekCard[6]
        todayTransaction[0] = weekDeposit[6]
        todayTransaction[1] = weekWithdraw[6]
        todayTransaction[2] = weekTransfer[6]
        todayTransaction[3] = weekCard[6]
    }

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

    createChart(chart1, 'doughnut', pieOpt(pie1_legend, pie1_bg, todayHis, pie1_title))
    createChart(chart2, 'doughnut', pieOpt(pie2_legend, pie2_bg, todayTransaction, pie2_title))
    createChart(chart3, 'line', lineOpt(line1_legend, line1_bg, {
        weekDeposit,
        weekWithdraw,
        weekTransfer,
        weekCard
    }, line1_title))
    createChart(chart4, 'doughnut', pieOpt(pie3_legend, pie3_bg, weekHis, pie3_title))

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

    $('#password').html('*'.repeat($('#password').val())
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
        if(currShow == 'deposit-function'){
            $('#deposit-card-number-mes').val('')
            $('#deposit-expiration-date-mes').val('')
            $('#deposit-cvv-mes').val('')
            $('#deposit-amount-mes').val('')
        }
        if(currShow == 'withdraw-function'){
            $('#withdraw-card-number-mes').val('')
            $('#withdraw-expiration-date-mes').val('')
            $('#withdraw-cvv-mes').val('')
            $('#withdraw-amount-mes').val('')
            $('#withdraw-amount-mes').val('')
        }
        if(currShow == 'transfer-function'){
            $('#transfer-phone-number').val('')
            $('#me-fee').prop('checked',true)
            $('#transfer-amount-mes').val('')
        }
        if(currShow == 'card-function'){
            $('option[value="viettel"]').prop('selected',true)
            $('option[value="10000"]').prop('selected',true)
            $('option[value="1"]').prop('selected',true)
        }
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

    function validateCardInfo(form, number, cvv, amount){

        amount = Number(amount)
        const numberOnly = /^[0-9]{6,}$/
        const cvvNumber = /^[0-9]{3,}$/
        let flagCardInfo = true

        if(!numberOnly.test(number)){
            $('#'+form+'-card-number-mes').text('Card number must contain 6 number')
            flagCardInfo = false
        }else{
            $('#'+form+'-card-number-mes').text('')
        }
        if(!cvvNumber.test(cvv)){
            $('#'+form+'-cvv-mes').text('CVV code must contain 3 number')
            flagCardInfo = false
        }else{
            $('#'+form+'-cvv-mes').text('')
        }
        if(amount <= 0 || Number.isNaN(amount) || !Number.isInteger(amount) || amount % 50000 != 0){
            $('#'+form+'-amount-mes').text('Invalid amount')
            flagCardInfo = false
        }else{
            $('#'+form+'-amount-mes').text('')
        }
        return flagCardInfo
    }

    $('#deposit-btn').click(function (){
        const cardNumber = $('#deposit-card-number').val()
        const expirationDate = $('#deposit-expiration-date').val()
        const cvvCode = $('#deposit-cvv-code').val()
        const depositAmount = $('#deposit-amount').val()
        if(validateCardInfo('deposit',cardNumber,cvvCode,depositAmount)){
            $.ajax({
                url: '',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: email,
                    cardnumber: cardNumber,
                    expdate: expirationDate,
                    cvv: cvvCode,
                    amount: Number(depositAmount)
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

    // withdraw handle

    $('#withdraw-btn').click(function (){
        const cardNumber = $('#withdraw-card-number').val()
        const expirationDate = $('#withdraw-expiration-date').val()
        const cvvCode = $('#withdaw-cvv-code').val()
        const withdrawAmount = $('#withdraw-amount').val()
        const note = $('#withdraw-mes').val()
        if(validateCardInfo('withdraw',cardNumber,cvvCode,withdrawAmount)){
            $.ajax({
                url: '',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: email,
                    cardnumber: cardNumber,
                    expdate: expirationDate,
                    cvv: cvvCode,
                    amount: Number(withdrawAmount),
                    note: note
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

    // transfer handle

    function checkPhone(number){
        const phoneRegex = /^[0-9]{10,}$/
        if(!phoneRegex.test(number)){
            $('#transfer-phone-number-mes').text('Invalid phone number')
            return false
        }else{
            $('#transfer-phone-number-mes').text('')
        }
        return true
    }

    function validateTransfer(phone,amount){
        amount = Number(amount)
        let flagTransfer = checkPhone(phone)
        if(amount <= 0 || Number.isNaN(amount) || !Number.isInteger(amount) || amount % 50000 != 0){
            $('#transfer-amount-mes').text('Invalid amount')
            flagTransfer = false
        }else{
            $('#transfer-amount-mes').text('')
        }
        return flagTransfer
    }

    $('#transfer-btn').click(function (){
        const phoneNumber = $('#transfer-phone-number').val()
        const transferAmount = $('#transfer-amount').val()
        const note = $('#transfer-mes').val()
        if(validateTransfer(phoneNumber,transferAmount)){
            $.ajax({
                url: '',
                type: 'POST',
                dataType: 'json',
                data: {
                    email: email,
                    amount: Number(transferAmount),
                    note: note
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

    $('#transfer-phone-number').change(function (){
        if(checkPhone($(this).val())){
            $.ajax({
                url: '',

            })
        }
    })

    // card handle

    $('#card-btn').click(function (){
        const cardNetwork = $('#card-netword').val()
        const cardPrice = $('#card-price').val()
        const quantity = $('#card-quantity').val()
        $.ajax({
            url: '',
            type: 'POST',
            dataType: 'json',
            data: {
                email: email,
                networkName: cardNetwork,
                price: Number(cardPrice),
                quantity: Number(quantity)
            }
        })
        .done(function(data){
            updateHistory()
            showMes(data.data, 'success')
        })
        .fail(function(data){
            showMes(data.data, 'error')
        })
    })
})