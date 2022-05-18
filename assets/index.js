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

    function pieOpt (label, bgColor, quantity, title) {
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
        return {data: data, opt: opt}
    }

    function lineOpt(label, bgColor, quantity, title){
        const data = {
            labels: label,
            datasets: [
                {
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
                    label: 'Tranfer',
                    backgroundColor: bgColor[2],
                    borderColor: bgColor[2],
                    data: quantity.tranfer
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
        return {data: data, opt: opt}
    }

    const pie1_legend = ['Income', 'Spending']
    const pie1_bg = ['#4b961c', '#ff084a']
    const pie1_title = 'Today Income/Spending Scale'

    const pie2_legend = ['Deposit', 'Withdraw','Tranfer','Top-up Card']
    const pie2_bg = ['#4b961c', '#ff084a','#03396c','#ffbf00']
    const pie2_title = 'Today Transaction Scale'

    const line1_legend = ['','','','','','','']
    const line1_bg = pie2_bg
    const line1_title = 'Transition Scale in recent days'

    const pie3_legend = pie1_legend
    const pie3_bg = pie1_bg
    const pie3_title = 'Income/Spending Scale in recent days'

    const deposit = [220, 237, 808, 308, 168, 937, 429]
    const withdraw = [325, 42, 146, 617, 371, 290, 872]
    const tranfer = [730, 113, 545, 323, 160, 379, 498]
    const card = [920, 712, 911, 700, 70, 672, 433]

    createChart(chart1, 'doughnut', pieOpt(pie1_legend, pie1_bg, [40, 60], pie1_title))
    createChart(chart2, 'doughnut', pieOpt(pie2_legend, pie2_bg, [20, 30, 40, 10], pie2_title))
    createChart(chart3, 'line', lineOpt(line1_legend,line1_bg,{deposit,withdraw,tranfer,card}, line1_title))
    createChart(chart4, 'doughnut', pieOpt(pie3_legend, pie3_bg, [60,40], pie3_title))

    // sidebar handle

    let currShow = 'home'

    function showSection(btn ,section) {
        $('#'+section.replace(' ','-').toLowerCase()).fadeIn()
        $('#section-name').text(section)
        $('#section-expand').text('')
        $('#'+currShow+'-btn > i' ).removeClass('icon-active')
        btn.children().addClass('icon-active')
        currShow = section.replace(' ','-').toLowerCase()
    }

    $('#home-btn').click(function (){
        $('#'+currShow).fadeOut(200,function(){
            showSection($('#home-btn'),'Home')
        })
    })

    $('#history-btn').click(function (){
        $('#'+currShow).fadeOut(200,function(){
            showSection($('#history-btn'),'History')
        })
    })

    $('#dashboard-btn').click(function (){
        $('#'+currShow).fadeOut(200,function(){
            showSection($('#dashboard-btn'),'Dashboard')
        })
    })

    $('#your-account-btn').click(function (){
        $('#'+currShow).fadeOut(200,function(){
            showSection($('#your-account-btn'),'Your Account')
        })
    })

    // show/hide password

    let flag = true
    let balance = $('#balance').text()
    passwordHandle()

    function passwordHandle() {
        if(flag){
            $('#balance').text('*'.repeat(balance.length))
            $('.show-pass').addClass('fa-eye-slash')
            $('.show-pass').removeClass('fa-eye')
        }else{
            $('#balance').text(balance)
            $('.show-pass').addClass('fa-eye')
            $('.show-pass').removeClass('fa-eye-slash')
        }
    }

    $('.show-pass').click(function (){
        passwordHandle()
        flag = !flag
    })

    //section name handle

    $('#section-name').click(function (){
        const sectionName = $('#section-name').attr('section-name')
        if($('#section-expand').text() != ''){
            $('#'+sectionName).fadeIn()
            $('#section-expand').text('')
        }
    })

    function showFunction(name){
        $('#section-expand').text(' > ' + name)
        $('#home').fadeOut()
    }

    // deposit handle

    $('#deposit').click(function (){
        showFunction('Deposit')
    })

    // withdraw handle

    $('#withdraw').click(function (){
        showFunction('Withdraw')
    })

    // tranfer handle

    $('#tranfer').click(function (){
        showFunction('Tranfer')
    })

    // deposit handle

    $('#toppUp-card').click(function (){
        showFunction('Top-up Card')
    })

    // user info

    userInfo = {name: 'User Name', birthday: '02/05/2002', phone: '0123456789', email: 'user@gmail.com', address: 'Tp. Hồ Chí Minh', password: '123456789'}

    $('#name').text(userInfo.name)
    $('#birthday').text(userInfo.birthday)
    $('#phone-number').text(userInfo.phone)
    $('#email').text(userInfo.email)
    $('#address').text(userInfo.address)
    $('#password').text('*'.repeat(userInfo.password.length))

})